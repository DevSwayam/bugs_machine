// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity ^0.8.20;

import "../lib/TFHE.sol";

import "../abstracts/Reencrypt.sol";

import "./EncryptedERC20.sol";

contract BlindAuction is Reencrypt {
    uint public endTime;

    address public beneficiary;

    // Current highest bid.
    euint64 internal highestBid;

    // Mapping from bidder to their bid value.
    mapping(address => euint64) public bids;

    // Number of bid
    uint public bidCounter;

    // The token contract used for encrypted bids.
    EncryptedERC20 public tokenContract;

    // Whether the auction object has been claimed.
    ebool public objectClaimed;

    // If the token has been transferred to the beneficiary
    bool public tokenTransferred;

    bool public stoppable;

    bool public manuallyStopped = false;

    // The owner of the contract.
    address public contractOwner;

    // The function has been called too early.
    // Try again at `time`.
    error TooEarly(uint time);
    // The function has been called too late.
    // It cannot be called after `time`.
    error TooLate(uint time);

    event Winner(address who);

    constructor(address _beneficiary, EncryptedERC20 _tokenContract, uint biddingTime, bool isStoppable) {
        beneficiary = _beneficiary;
        tokenContract = _tokenContract;
        endTime = block.timestamp + biddingTime;
        objectClaimed = TFHE.asEbool(false);
        tokenTransferred = false;
        bidCounter = 0;
        stoppable = isStoppable;
        contractOwner = msg.sender;
    }

    // Bid an `encryptedValue`.
    function bid(bytes calldata encryptedValue) public onlyBeforeEnd {
        euint64 value = TFHE.asEuint64(encryptedValue);
        euint64 existingBid = bids[msg.sender];
        if (TFHE.isInitialized(existingBid)) {
            ebool isHigher = TFHE.lt(existingBid, value);
            // Update bid with value
            bids[msg.sender] = TFHE.select(isHigher, value, existingBid);
            // Transfer only the difference between existing and value
            euint64 toTransfer = value - existingBid;
            // Transfer only if bid is higher
            euint64 amount = TFHE.select(isHigher, toTransfer, TFHE.asEuint64(0));
            tokenContract.transferFrom(msg.sender, address(this), amount);
        } else {
            bidCounter++;
            bids[msg.sender] = value;
            tokenContract.transferFrom(msg.sender, address(this), value);
        }
        euint64 currentBid = bids[msg.sender];
        if (!TFHE.isInitialized(highestBid)) {
            highestBid = currentBid;
        } else {
            highestBid = TFHE.select(TFHE.lt(highestBid, currentBid), currentBid, highestBid);
        }
    }

    function getBid(
        bytes32 publicKey,
        bytes calldata signature
    ) public view onlySignedPublicKey(publicKey, signature) returns (bytes memory) {
        return TFHE.reencrypt(bids[msg.sender], publicKey, 0);
    }

    // Returns the user bid
    function stop() public onlyContractOwner {
        require(stoppable);
        manuallyStopped = true;
    }

    // Returns an encrypted value of 0 or 1 under the caller's public key, indicating
    // if the caller has the highest bid.
    function doIHaveHighestBid(
        bytes32 publicKey,
        bytes calldata signature
    ) public view onlyAfterEnd onlySignedPublicKey(publicKey, signature) returns (bytes memory) {
        if (TFHE.isInitialized(highestBid) && TFHE.isInitialized(bids[msg.sender])) {
            return TFHE.reencrypt(TFHE.le(highestBid, bids[msg.sender]), publicKey);
        } else {
            return TFHE.reencrypt(TFHE.asEuint64(0), publicKey);
        }
    }

    // Claim the object. Succeeds only if the caller has the highest bid.
    function claim() public onlyAfterEnd {
        ebool canClaim = TFHE.and(TFHE.le(highestBid, bids[msg.sender]), TFHE.not(objectClaimed));

        objectClaimed = canClaim;
        bids[msg.sender] = TFHE.select(canClaim, TFHE.asEuint64(0), bids[msg.sender]);
        // emit Winner(msg.sender);
    }

    // Transfer token to beneficiary
    function auctionEnd() public onlyAfterEnd {
        require(!tokenTransferred);

        tokenTransferred = true;
        tokenContract.transfer(beneficiary, highestBid);
    }

    // Withdraw a bid from the auction to the caller once the auction has stopped.
    function withdraw() public onlyAfterEnd {
        euint64 bidValue = bids[msg.sender];
        ebool isHighestBid = TFHE.eq(bidValue, highestBid);
        ebool canWithdraw = TFHE.not(TFHE.and(isHighestBid, TFHE.not(objectClaimed)));
        tokenContract.transfer(msg.sender, TFHE.select(canWithdraw, bidValue, TFHE.asEuint64(0)));
        bids[msg.sender] = TFHE.select(canWithdraw, TFHE.asEuint64(0), bids[msg.sender]);
    }

    modifier onlyBeforeEnd() {
        if (block.timestamp >= endTime || manuallyStopped == true) revert TooLate(endTime);
        _;
    }

    modifier onlyAfterEnd() {
        if (block.timestamp <= endTime && manuallyStopped == false) revert TooEarly(endTime);
        _;
    }

    modifier onlyContractOwner() {
        require(msg.sender == contractOwner);
        _;
    }
}

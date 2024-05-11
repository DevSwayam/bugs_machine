// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

import {IERC20} from "../lib/openzeppelin-contracts/contracts/interfaces/IERC20.sol";

/*//////////////////////////////////////////////////////////////
                            INTERFACE
    //////////////////////////////////////////////////////////////*/

interface ISlotMachine {
    function handle(
        uint16 _randomNumber,
        uint256 _uniqueId,
        address _userAddress
    ) external;
}

interface IInterchainAccountRouter {
    function callRemote(
        uint32 _destination,
        address _to,
        uint256 _value,
        bytes calldata _data
    ) external returns (bytes32);

    function getRemoteInterchainAccount(uint32 _destination, address _owner)
        external
        view
        returns (address);
}

contract SlotMachine is ISlotMachine {
    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    // The Allowed caller Contract which can send random numbers
    address private s_CallerContract;

    // EOA address of owner for intialisation of contract
    address private i_Owner;

    // For initialising contract only Once
    bool private s_IsInitialised;

    // ERC20 Contract Address for BUGS
    address private s_BugsContractAddress;

    // Mapping of user addresses to the timestamp of their last spin resolution
    // Used to track users waiting for their spins to be resolved
    mapping(address => uint256) private s_UserAddressToLastTimestamp;

    // Mapping of user addresses to the amount of bugs betted by each user
    mapping(address => uint256) private s_UserAddressToBettedBugAmount;

    // The minimum amount of bugs the contract should have to be playable
    uint256[3] private s_BugBettingTiers = [1000 ether, 2000 ether, 5000 ether];

    // The betting amount according to tiers of machine
    uint256[3] private s_BugBettingTierFees = [5 ether, 10 ether, 15 ether];

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event randomNumberUsed(
        uint16 indexed number,
        uint256 indexed uniqueId,
        address indexed user
    );

    event betPlaced(address indexed userAddress, uint256 indexed bettedAmount);

    event betResolved(
        address indexed userAddress,
        uint256 indexed bettedAmount,
        uint256 indexed amountWonByUser
    );

    /*//////////////////////////////////////////////////////////////
                                 Errors
    //////////////////////////////////////////////////////////////*/

    error SlotMachine__onlyCallerContract();
    error SlotMachine__onlyOwmer();
    error SlotMachine__alreadyInitialised();
    error SlotMachine__WaitingToGetResolved();
    error SlotMachine__NotEnoughBugsAmount();
    error SlotMachine__UserDidntPutABet();
    error SlotMachine__UserApprovalAmountIsNotSufficient();
    error SlotMachine__DoesNotHaveEnoughBugsToWithDraw();
    error SlotMachine__DoesNotHaveEnoughBugsToPlay();
    error SlotMachine__UserNotInQueue();

    /*//////////////////////////////////////////////////////////////
                               MODIFIERS
    //////////////////////////////////////////////////////////////*/

    modifier _onlyCallerContract() {
        if (msg.sender != s_CallerContract) {
            revert SlotMachine__onlyCallerContract();
        }
        _;
    }

    modifier _onlyOwner() {
        if (msg.sender != i_Owner) {
            revert SlotMachine__onlyOwmer();
        }
        _;
    }

    modifier _isInitialised() {
        if (s_IsInitialised) {
            revert SlotMachine__alreadyInitialised();
        }
        _;
    }

    modifier _isPlayable() {
        uint256 _bugBalanceOfContract = IERC20(s_BugsContractAddress).balanceOf(
            address(this)
        );
        if (_bugBalanceOfContract < s_BugBettingTiers[0]) {
            revert SlotMachine__DoesNotHaveEnoughBugsToPlay();
        }
        _;
    }

    modifier _onlyOnce() {
        if (s_UserAddressToLastTimestamp[msg.sender] != 0) {
            revert SlotMachine__WaitingToGetResolved();
        }
        _;
    }

    /*//////////////////////////////////////////////////////////////
                                Constructor
    //////////////////////////////////////////////////////////////*/

    constructor() {
        i_Owner = msg.sender;
    }

    /*//////////////////////////////////////////////////////////////
                                External Functions
    //////////////////////////////////////////////////////////////*/

    function initialize(address _callerContract, address _bugsContractAddress)
        external
        _onlyOwner
        _isInitialised
    {
        s_CallerContract = _callerContract;
        s_BugsContractAddress = _bugsContractAddress;
        s_IsInitialised = true;
    }

    function spinSlotMachine() external _onlyOnce _isPlayable {
        address _userAddress = msg.sender;
        IERC20 _bugs = IERC20(s_BugsContractAddress);

        uint256 _userBugsBalance = _bugs.balanceOf(_userAddress);

        uint256 _currentBettingAmount = getCurrentBettingAmount();

        if (_userBugsBalance < _currentBettingAmount) {
            revert SlotMachine__NotEnoughBugsAmount();
        }

        uint256 _userTotalApproval = _bugs.allowance(
            _userAddress,
            address(this)
        );

        if (_userTotalApproval < _currentBettingAmount) {
            revert SlotMachine__UserApprovalAmountIsNotSufficient();
        }

        _bugs.transferFrom(_userAddress, address(this), _currentBettingAmount);

        s_UserAddressToLastTimestamp[_userAddress] = block.timestamp;

        s_UserAddressToBettedBugAmount[_userAddress] = _currentBettingAmount;

        emit betPlaced(_userAddress, _currentBettingAmount);
    }

    function handle(
        uint16 _randomNumber,
        uint256 _uniqueId,
        address _userAddress
    ) external _onlyCallerContract {
        if (s_UserAddressToLastTimestamp[_userAddress] == 0) {
            revert SlotMachine__UserDidntPutABet();
        }
        if (s_UserAddressToBettedBugAmount[_userAddress] == 0) {
            revert SlotMachine__UserDidntPutABet();
        }

        emit randomNumberUsed(_randomNumber, _uniqueId, _userAddress);

        resolveWinner(_userAddress, _randomNumber);
    }

    function resolveWinner(address _userAddress, uint16 _randomNumber)
        internal
    {
        uint256 _userBettedBugAmount = s_UserAddressToBettedBugAmount[
            _userAddress
        ];

        uint256 _bugsAmountWonByUser = 0;
        uint256 _moduloResult = 0;

        if (_userBettedBugAmount == s_BugBettingTierFees[0]) {
            _moduloResult = _randomNumber % 10000;
        } else {
            _moduloResult = _randomNumber % 100000;
        }

        if (_moduloResult == 9999) {
            _bugsAmountWonByUser = IERC20(s_BugsContractAddress).balanceOf(
                address(this)
            );
        }

        if (_bugsAmountWonByUser > 0) {
            IERC20(s_BugsContractAddress).transfer(
                _userAddress,
                _bugsAmountWonByUser
            );
        }

        emit betResolved(
            _userAddress,
            _userBettedBugAmount,
            _bugsAmountWonByUser
        );

        s_UserAddressToLastTimestamp[_userAddress] = 0;
        s_UserAddressToBettedBugAmount[_userAddress] = 0;
    }

    function withdrawSlotMachineBugs(address _withDrawAddress)
        external
        _onlyOwner
    {
        IERC20 _bugs = IERC20(s_BugsContractAddress);
        uint256 _bugBalanceOfContract = _bugs.balanceOf(address(this));
        if (_bugBalanceOfContract == 0) {
            revert SlotMachine__DoesNotHaveEnoughBugsToWithDraw();
        }
        _bugs.transfer(_withDrawAddress, _bugBalanceOfContract);
    }

    function forceWithdrawlIfBridgeTransactionFails() external {
        address _userAddress = msg.sender;
        uint256 _userLastTimeStamp = s_UserAddressToLastTimestamp[_userAddress];

        if (_userLastTimeStamp == 0) {
            revert SlotMachine__UserNotInQueue();
        }
        if (block.timestamp - _userLastTimeStamp < 3600) {
            revert SlotMachine__UserNotInQueue();
        }

        uint256 _userBettedBugAmount = s_UserAddressToBettedBugAmount[
            _userAddress
        ];

        if (_userBettedBugAmount == 0) {
            revert SlotMachine__UserNotInQueue();
        }

        IERC20(s_BugsContractAddress).transfer(
            _userAddress,
            _userBettedBugAmount
        );
        s_UserAddressToBettedBugAmount[_userAddress] = 0;
        s_UserAddressToLastTimestamp[_userAddress] = 0;
    }

    /*//////////////////////////////////////////////////////////////
                               Getter Functions
    //////////////////////////////////////////////////////////////*/

    function getCallerContract() external view returns (address) {
        return s_CallerContract;
    }

    function getOwner() external view returns (address) {
        return i_Owner;
    }

    function getIsInitialised() external view returns (bool) {
        return s_IsInitialised;
    }

    function getBugsContractAddress() external view returns (address) {
        return s_BugsContractAddress;
    }

    function getUserAddressToIsWaiting(address userAddress)
        external
        view
        returns (bool)
    {
        if (s_UserAddressToLastTimestamp[userAddress] == 0) {
            return false;
        } else {
            return true;
        }
    }

    function getIsEligibleForForceWithdrawl() external view returns (bool) {
        uint256 _userLastTimeStamp = s_UserAddressToLastTimestamp[msg.sender];
        if (block.timestamp - _userLastTimeStamp < 3600) {
            return false;
        } else {
            return true;
        }
    }

    function getCurrentBettingAmount() public view returns (uint256) {
        uint256 _currentBanalceOfBugs = IERC20(s_BugsContractAddress).balanceOf(
            address(this)
        );
        if (
            _currentBanalceOfBugs >= s_BugBettingTiers[0] &&
            _currentBanalceOfBugs < s_BugBettingTiers[1]
        ) {
            return s_BugBettingTierFees[0];
        } else if (
            _currentBanalceOfBugs >= s_BugBettingTiers[1] &&
            _currentBanalceOfBugs < s_BugBettingTiers[2]
        ) {
            return s_BugBettingTierFees[1];
        } else {
            return s_BugBettingTierFees[2];
        }
    }

    function getCurrentWinningAmount() external view returns (uint256) {
        return (IERC20(s_BugsContractAddress).balanceOf(address(this)));
    }
}

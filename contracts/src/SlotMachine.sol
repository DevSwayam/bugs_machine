// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

import {IERC20} from "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.9/contracts/interfaces/IERC20.sol";

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
    address immutable i_Owner;

    // For initialising contract only Once
    bool private s_IsInitialised;

    // ERC20 Contract Address for BUGS
    address private s_BugsContractAddress;

    // Users in Queue waiting for there spin to get resolved
    mapping(address => bool) private s_UserAddressToIsWaiting;

    // Bugs amount to bet
    uint256 private s_BettingBugsAmount = 100 * 10**18;

    // Users to there Betted Bug Amount
    mapping(address => uint256) private s_UserAddressToBettedBugAmount;

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

    modifier _onlyOnce() {
        if (s_UserAddressToIsWaiting[msg.sender] == true ) {
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

    function spinSlotMachine() external _onlyOnce {
        address _userAddress = msg.sender;

        IERC20 _bugs = IERC20(s_BugsContractAddress);

        
        // check the balance of user from bugs contract if not sufficient revert
        uint256 _userBugsBalance = _bugs.balanceOf(_userAddress);

        if (_userBugsBalance < s_BettingBugsAmount) {
            revert SlotMachine__NotEnoughBugsAmount();
        }

        // check the whether the contract has approval is not revert
        uint256 _userTotalApproval = _bugs.allowance(
            _userAddress,
            address(this)
        );

        if (_userTotalApproval < s_BettingBugsAmount) {
            revert SlotMachine__UserApprovalAmountIsNotSufficient();
        }

        // transfer 100 bugs from user to this contract
        _bugs.transferFrom(_userAddress, address(this), s_BettingBugsAmount);

        // set the mapping of users to their holding bugs in contract to 100 BUGS
        s_UserAddressToBettedBugAmount[_userAddress] = s_BettingBugsAmount;

        // setIsWaiting true
        s_UserAddressToIsWaiting[_userAddress] = true;

        // Emit the betting event for users
        emit betPlaced(_userAddress, s_BettingBugsAmount);
    }

    function updateBettingBugsAmount(uint256 _newBettingBugAmount)
        external
        _onlyOwner
    {
        s_BettingBugsAmount = _newBettingBugAmount;
    }

    function updateCallerContract(address _newCallerContractAddress)
        external
        _onlyOwner
    {
        s_CallerContract = _newCallerContractAddress;
    }

    function updateBugsContract(address _newBugsContractAddress)
        external
        _onlyOwner
    {
        s_BugsContractAddress = _newBugsContractAddress;
    }

    function handle(
        uint16 _randomNumber,
        uint256 _uniqueId,
        address _userAddress
    ) external _onlyCallerContract {
        if (s_UserAddressToIsWaiting[_userAddress] == false) {
            revert SlotMachine__UserDidntPutABet();
        }

        // event emit the last uniqueId, randomNumber and userAddress
        emit randomNumberUsed(_randomNumber, _uniqueId, _userAddress);

        // send the random number to resolveTheWinner
        resolveWinner(_userAddress, _randomNumber);
    }

    function resolveWinner(address _userAddress, uint16 _randomNumber)
        internal
    {
        uint8 _moduloResult = uint8(_randomNumber % 10);
        uint256 _bugsAmountWonByUser;
        uint256 _bettedBugsAmount = s_UserAddressToBettedBugAmount[
            _userAddress
        ];

        if (_moduloResult == 0 || _moduloResult == 1) {
            _bugsAmountWonByUser = _bettedBugsAmount * 2;
        } else if (_moduloResult == 2) {
            _bugsAmountWonByUser = (_bettedBugsAmount * 3) / 2;
        } else if (_moduloResult == 3 || _moduloResult == 4) {
            _bugsAmountWonByUser = _bettedBugsAmount;
        } else {
            _bugsAmountWonByUser = 0;
        }

        // according to the number provide him bugs
        if (_bugsAmountWonByUser > 0) {
            IERC20(s_BugsContractAddress).transferFrom(
                address(this),
                _userAddress,
                _bugsAmountWonByUser
            );
        }

        // event(bettedAmount, winningAmount)
        emit betResolved(_userAddress, _bettedBugsAmount, _bugsAmountWonByUser);

        // setIsWaiting to false
        s_UserAddressToIsWaiting[_userAddress] = false;

        // set s_UserAddressToBettedBugAmount to 0
        s_UserAddressToBettedBugAmount[_userAddress] = 0;

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
        return s_UserAddressToIsWaiting[userAddress];
    }

    function getBettingBugsAmount() external view returns (uint256) {
        return s_BettingBugsAmount;
    }

    function getUserAddressToBettedBugAmount(address userAddress)
        external
        view
        returns (uint256)
    {
        return s_UserAddressToBettedBugAmount[userAddress];
    }
}

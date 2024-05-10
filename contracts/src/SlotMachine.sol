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

    // Users in Queue waiting for there spin to get resolved
    mapping(address => uint256) private s_UserAddressToLastTimestamp;

    // Bugs amount to bet
    uint256 private s_BettingBugsAmount = 100 * 10**18;

    // The minimum amount of bugs the contract should have to be playable
    uint256 private s_InitialBugBalance = 500 * 10**18;

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
        if (_bugBalanceOfContract < s_InitialBugBalance) {
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

        // check the balance of user from bugs contract if not sufficient revert
        uint256 _userBugsBalance = _bugs.balanceOf(_userAddress);

        if (_userBugsBalance < s_BettingBugsAmount) {
            revert SlotMachine__NotEnoughBugsAmount();
        }

        // check the whether the contract has enough approval if not revert
        uint256 _userTotalApproval = _bugs.allowance(
            _userAddress,
            address(this)
        );

        if (_userTotalApproval < s_BettingBugsAmount) {
            revert SlotMachine__UserApprovalAmountIsNotSufficient();
        }

        // transfer 100 bugs from user to this contract
        _bugs.transferFrom(_userAddress, address(this), s_BettingBugsAmount);

        // setUserAddressToLastTimeStamp
        s_UserAddressToLastTimestamp[_userAddress] = block.timestamp;

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

    function updateOwnerOfSlotMachine(address _newOwner) external _onlyOwner{
        i_Owner = _newOwner;
    }

    function handle(
        uint16 _randomNumber,
        uint256 _uniqueId,
        address _userAddress
    ) external _onlyCallerContract {
        if (s_UserAddressToLastTimestamp[_userAddress] == 0) {
            revert SlotMachine__UserDidntPutABet();
        }

        emit randomNumberUsed(_randomNumber, _uniqueId, _userAddress);

        resolveWinner(_userAddress, _randomNumber);
    }

    function resolveWinner(address _userAddress, uint16 _randomNumber)
        internal
    {
        uint16 _moduloResult = _randomNumber % 10;
        uint256 _bugsAmountWonByUser;

        if (_moduloResult == 0 || _moduloResult == 1) {
            _bugsAmountWonByUser = s_BettingBugsAmount * 2;
        } else if (_moduloResult == 2) {
            _bugsAmountWonByUser = (s_BettingBugsAmount * 3) / 2;
        } else if (_moduloResult == 3 || _moduloResult == 4) {
            _bugsAmountWonByUser = s_BettingBugsAmount;
        } else {
            _bugsAmountWonByUser = 0;
        }

        // according to the random number the winning amount for user will be decided
        if (_bugsAmountWonByUser > 0) {
            IERC20(s_BugsContractAddress).transfer(
                _userAddress,
                _bugsAmountWonByUser
            );
        }

        // event(bettedAmount, winningAmount)
        emit betResolved(
            _userAddress,
            s_BettingBugsAmount,
            _bugsAmountWonByUser
        );

        // setting the last timestamp to 0
        s_UserAddressToLastTimestamp[_userAddress] = 0;
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
        _bugs.transfer(
            _withDrawAddress,
            _bugBalanceOfContract
        );
    }

    function withdrawSlotMachineProfit(address _withDrawAddress)
        external
        _onlyOwner
    {
        IERC20 _bugs = IERC20(s_BugsContractAddress);
        uint256 _bugBalanceOfContract = _bugs.balanceOf(address(this));

        if (_bugBalanceOfContract < s_InitialBugBalance * 2) {
            revert SlotMachine__DoesNotHaveEnoughBugsToWithDraw();
        }

        _bugs.transfer(
            _withDrawAddress,
            _bugBalanceOfContract - s_InitialBugBalance * 2
        );
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

        IERC20(s_BugsContractAddress).transfer(
            _userAddress,
            s_BettingBugsAmount
        );
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

    function getBettingBugsAmount() external view returns (uint256) {
        return s_BettingBugsAmount;
    }

    function totalProfitForSlotMachine() external view returns (uint256) {
        IERC20 _bugs = IERC20(s_BugsContractAddress);
        uint256 _bugBalanceOfContract = _bugs.balanceOf(address(this));
       
        if(_bugBalanceOfContract > s_InitialBugBalance * 2){
            return  _bugBalanceOfContract - s_InitialBugBalance * 2;
        }else{
            return 0;
        }
    }

    function isEligibleForForceWithdrawl() external view returns (bool) {
        uint256 _userLastTimeStamp = s_UserAddressToLastTimestamp[msg.sender];
        if (block.timestamp - _userLastTimeStamp < 3600) {
            return false;
        } else {
            return true;
        }
    }
}

// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

/*//////////////////////////////////////////////////////////////
                           Interface
    //////////////////////////////////////////////////////////////*/

interface IInterchainExecuteRouter {
    function callRemote(
        uint32 _destination,
        address _to,
        uint256 _value,
        bytes calldata _data,
        bytes memory _callback
    ) external returns (bytes32);

    function getRemoteInterchainAccount(uint32 _destination, address _owner)
        external
        view
        returns (address);
}


interface ISlotMachine {
    function handle(
        uint8 _messageType,
        uint256 _amount,
        address _userAddress
    ) external returns(uint8,uint256,address);
}

import {IERC20} from "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract BugsBridge {
    // For initialising contract only Once
    bool private s_IsInitialised;

    // Address of the SlotMachine contract on Inco Network
    address private s_SlotMachineContractAddress;

    // Domain for Inco Network
    uint32 private constant s_DestinationDomain = 9090;

    // callback Router Contract Deployed on RedStone Network
    address private s_IexRouter;

    // EOA address of owner for intialisation of contract
    address immutable i_Owner;

    // ERC20 Contract Address for BUGS
    address private s_BugsContractAddress;

    // The Allowed caller Contract which can call callback functions
    address private s_CallerContract;

    // Mapping of userAddress to isWaiting
    mapping(address => bool) private s_UserAddressToIsWaiting;

    // Mapping of userAddress to the amount of bugs locked in contract
    mapping(address => uint256) private s_UserAddressToLockBugs;

    uint8 private constant s_DepositMessageType = 1;
    uint8 private constant s_WithdrawMwssageType = 2;

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event bugsDeposited(
        address indexed userAddress,
        uint256 indexed bugsAmount
    );

    /*//////////////////////////////////////////////////////////////
                                 Errors
    //////////////////////////////////////////////////////////////*/
    error BridgeContract__onlyOwmer();
    error BridgeContract__alreadyInitialised();
    error BridgeContract__userDoesnotHaveEnoughBugs();
    error BridgeContract__UserApprovalAmountIsNotSufficient();
    error BridgeContract__WaitingToGetResolved();
    error BridgeContract__OnlyCallerContract();
    error BridgeContract__UserDidNotLockBugs();
    error BridgeContract__MessageTypeDoesNotExist();
    error BridgeContract__UserDidNotDepositSufficientBugs();

    /*//////////////////////////////////////////////////////////////
                               MODIFIERS
    //////////////////////////////////////////////////////////////*/
    modifier _onlyOwner() {
        if (msg.sender != i_Owner) {
            revert BridgeContract__onlyOwmer();
        }
        _;
    }

    modifier _isInitialised() {
        if (s_IsInitialised) {
            revert BridgeContract__alreadyInitialised();
        }
        _;
    }

    modifier _onlyOnce() {
        if (s_UserAddressToIsWaiting[msg.sender] == true) {
            revert BridgeContract__WaitingToGetResolved();
        }
        _;
    }

    modifier _onlyCallerContract() {
        if (msg.sender != s_CallerContract) {
            revert BridgeContract__OnlyCallerContract();
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

    function initialize(
        address _iexRouter,
        address _caller_contract,
        address _slotmachineContractAddress,
        address _bugsContractAddress
    ) external _onlyOwner _isInitialised {
        s_IexRouter = _iexRouter; // caller contract and iex router would be same
        s_CallerContract = _caller_contract; // caller contract and iex router would be same
        s_BugsContractAddress = _bugsContractAddress; // erc20 contract address
        s_SlotMachineContractAddress = _slotmachineContractAddress; // destination contract address
        s_IsInitialised = true;
    }

    function depositBugs(uint256 _bugsAmount) external _onlyOnce {
        address _userAddress = msg.sender;

        IERC20 _bugs = IERC20(s_BugsContractAddress);

        // check the balance of user from bugs contract if not sufficient revert
        uint256 _userBugsBalance = _bugs.balanceOf(_userAddress);

        if (_userBugsBalance < _bugsAmount) {
            revert BridgeContract__userDoesnotHaveEnoughBugs();
        }

        // check the whether the contract has approval is not revert
        uint256 _userTotalApproval = _bugs.allowance(
            _userAddress,
            address(this)
        );

        if (_userTotalApproval < _bugsAmount) {
            revert BridgeContract__UserApprovalAmountIsNotSufficient();
        }

        _bugs.transferFrom(_userAddress, address(this), _bugsAmount);

        s_UserAddressToIsWaiting[_userAddress] = true;
        s_UserAddressToLockBugs[_userAddress] += _bugsAmount;

        // Emit the betting event for users
        emit bugsDeposited(_userAddress, _bugsAmount);

        bridgeCall(s_DepositMessageType, _bugsAmount, _userAddress);
    }

    function withDrawAllRemainingBugs() external _onlyOnce {
        address _userAddress = msg.sender;

        if (s_UserAddressToLockBugs[_userAddress] == 0) {
            revert BridgeContract__UserDidNotLockBugs();
        }
        bridgeCall(s_WithdrawMwssageType, 0, _userAddress);

        s_UserAddressToIsWaiting[_userAddress] = true;
        
    }

    function callConfirmation(uint8 _messageType, uint256 _amount ,uint256 _userAddress) external _onlyCallerContract {
       
       address userAddress = address(uint160(_userAddress));
       
       if(_messageType == 1){
            s_UserAddressToIsWaiting[userAddress] = false;
       }
       else if(_messageType == 2){
            IERC20(s_BugsContractAddress).transfer(userAddress,_amount);
            s_UserAddressToIsWaiting[userAddress] = false;
            s_UserAddressToLockBugs[userAddress] = 0;
            
       }else{
        revert BridgeContract__MessageTypeDoesNotExist();
       }
    }

    function bridgeCall(
        uint8 _messageType,
        uint256 _amount,
        address _userAddress
    ) internal {
        // write logic here to make bridge call
        ISlotMachine _slotMachine = ISlotMachine(s_SlotMachineContractAddress);

        bytes memory _callback = abi.encodePacked(
            this.callConfirmation.selector);

        IInterchainExecuteRouter(s_IexRouter).callRemote(
            s_DestinationDomain,
            address(_slotMachine),
            0,
            abi.encodeCall(
                _slotMachine.handle,
                (_messageType, _amount, _userAddress)
            ),
            _callback
        );
    }

    // Getter functions

    function getICA(address _contract) external view returns (address) {
        return
            IInterchainExecuteRouter(s_IexRouter).getRemoteInterchainAccount(
                s_DestinationDomain,
                _contract
            );
    }

    // Getter for s_IsInitialized
    function getIsInitialized() external view returns (bool) {
        return s_IsInitialised;
    }

    // Getter for s_SlotMachineContractAddress
    function getSlotMachineContractAddress() external view returns (address) {
        return s_SlotMachineContractAddress;
    }

    // Getter for s_DestinationDomain
    function getDestinationDomain() external pure returns (uint32) {
        return s_DestinationDomain;
    }

    // Getter for s_IexRouter
    function getIexRouter() external view returns (address) {
        return s_IexRouter;
    }

    // Getter for i_Owner
    function getOwner() external view returns (address) {
        return i_Owner;
    }

    // Getter for s_BugsContractAddress
    function getBugsContractAddress() external view returns (address) {
        return s_BugsContractAddress;
    }

    // Getter for s_CallerContract
    function getCallerContract() external view returns (address) {
        return s_CallerContract;
    }

    // Getter for s_UserAddressToIsWaiting
    function isUserWaiting(address userAddress) external view returns (bool) {
        return s_UserAddressToIsWaiting[userAddress];
    }

    // Getter for s_UserAddressToLockBugs
    function getUserLockedBugs(address userAddress) external view returns (uint256) {
        return s_UserAddressToLockBugs[userAddress];
    }

    // Getter for s_DepositMessageType
    function getDepositMessageType() external pure returns (uint8) {
        return s_DepositMessageType;
    }

    // Getter for s_WithdrawMessageType
    function getWithdrawMessageType() external pure returns (uint8) {
        return s_WithdrawMwssageType;
    }
}

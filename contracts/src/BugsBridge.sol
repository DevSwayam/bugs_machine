// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;
import {IERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {Initializable} from "../lib/openzeppelin-contracts/contracts/proxy/utils/Initializable.sol";
import {ReentrancyGuard} from "../lib/openzeppelin-contracts/contracts/security/ReentrancyGuard.sol";

/*//////////////////////////////////////////////////////////////
                           Interface
    //////////////////////////////////////////////////////////////*/

interface IInterchainExecuteRouter {
    function callRemote(
        uint32 _destinationDomain,
        address _targetAddress,
        uint256 _value,
        bytes calldata _data,
        bytes memory _callbackData
    ) external returns (bytes32);

    function getRemoteInterchainAccount(
        uint32 _destinationDomain,
        address _ownerAddress
    ) external view returns (address);
}

interface ISlotMachine {
    function handle(
        uint8 _messageType,
        uint256 _amount,
        address _userAddress
    ) external returns (uint8, uint256, address);
}

contract BugsBridge is ReentrancyGuard, Ownable , Initializable{

    /*//////////////////////////////////////////////////////////////
                                 STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    // Address of the SlotMachine contract on the Inco Network
    address private s_SlotMachineContractAddress;

    // Domain identifier for the Inco Network
    uint32 private constant s_DestinationDomain = 9090;

    // Address of the Interchain Execute Router on the RedStone Network
    address private s_IexRouter;

    // ERC20 Contract Address for BUGS token
    address private s_BugsContractAddress;

    // Allowed caller contract address for callback functions
    address private s_CallerContract;

    // Mapping of user addresses to their waiting status
    mapping(address => bool) private s_UserAddressToIsWaiting;

    // Mapping of user addresses to the amount of locked BUGS tokens
    mapping(address => uint256) private s_UserAddressToLockBugs;

    // Indicates if the Slot Machine is operational
    bool private s_IsSlotMachineWorking;

    // Message type identifiers
    uint8 private constant s_DepositMessageType = 1;
    uint8 private constant s_WithdrawMessageType = 2;

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event BugsDeposited(address indexed userAddress, uint256 indexed bugsAmount);
    event BugsWithdrawn(address indexed userAddress, uint256 indexed bugsAmount);
    event CallBackConfirmed(address indexed userAddress);

    /*//////////////////////////////////////////////////////////////
                                 Errors
    //////////////////////////////////////////////////////////////*/
    error BridgeContract__OnlyOwner();
    error BridgeContract__AlreadyInitialized();
    error BridgeContract__UserDoesNotHaveEnoughBugs();
    error BridgeContract__UserApprovalAmountIsNotSufficient();
    error BridgeContract__WaitingToGetResolved();
    error BridgeContract__OnlyCallerContract();
    error BridgeContract__UserDidNotLockBugs();
    error BridgeContract__MessageTypeDoesNotExist();
    error BridgeContract__UserDidNotDepositSufficientBugs();
    error BridgeContract__SlotMachineIsNotWorking();
    error BridgeContract__AddressCannotBeZero();
    error BridgeContract__GreaterThanSlotMachineBalance();
    error BridgeContract__AmountCannotBeZero();

    /*//////////////////////////////////////////////////////////////
                               MODIFIERS
    //////////////////////////////////////////////////////////////*/

    modifier notZeroAddress(address _address) {
        if (_address == address(0)) {
            revert BridgeContract__AddressCannotBeZero();
        }
        _;
    }

    modifier isGamePlayable() {
        if (!s_IsSlotMachineWorking) {
            revert BridgeContract__SlotMachineIsNotWorking();
        }
        _;
    }

    modifier onlyOnce() {
        if (s_UserAddressToIsWaiting[msg.sender]) {
            revert BridgeContract__WaitingToGetResolved();
        }
        _;
    }

    modifier onlyCallerContract() {
        if (msg.sender != s_CallerContract) {
            revert BridgeContract__OnlyCallerContract();
        }
        _;
    }

    modifier amountCannotBeZero(uint256 _amount) {
        if (_amount == 0) {
            revert BridgeContract__AmountCannotBeZero();
        }
        _;
    }

    /*//////////////////////////////////////////////////////////////
                                Owner Only Functions
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Initializes the contract with necessary addresses
     * @param _iexRouter Address of the IexRouter contract
     * @param _callerContract Address of the caller contract
     * @param _slotMachineContractAddress Address of the SlotMachine contract
     * @param _bugsContractAddress Address of the BUGS token contract
     */
    function initialize(
        address _iexRouter,
        address _callerContract,
        address _slotMachineContractAddress,
        address _bugsContractAddress
    ) external onlyOwner initializer {
        s_IexRouter = _iexRouter;
        s_CallerContract = _callerContract;
        s_BugsContractAddress = _bugsContractAddress;
        s_SlotMachineContractAddress = _slotMachineContractAddress;
        s_IsSlotMachineWorking = true;
    }

    /**
     * @notice Updates the owner address
     * @param _newOwnerAddress New owner address
     */
    function updateOwnerAddress(address _newOwnerAddress) external onlyOwner notZeroAddress(_newOwnerAddress){
        transferOwnership(_newOwnerAddress);
    }

    /**
     * @notice Updates the caller contract address
     * @param _newCallerContract New caller contract address
     */
    function updateCallerContract(address _newCallerContract) external onlyOwner notZeroAddress(_newCallerContract){
        s_CallerContract = _newCallerContract;
    }

    /**
     * @notice Updates the IexRouter address
     * @param _newIexRouter New IexRouter address
     */
    function updateIexRouter(address _newIexRouter) external onlyOwner notZeroAddress(_newIexRouter){
        s_IexRouter = _newIexRouter;
    }

    /**
     * @notice Updates the SlotMachine contract address
     * @param _newSlotMachineAddress New SlotMachine contract address
     */
    function updateSlotMachineAddress(address _newSlotMachineAddress) external onlyOwner notZeroAddress(_newSlotMachineAddress){
        s_SlotMachineContractAddress = _newSlotMachineAddress;
    }

    /**
     * @notice Allows the owner to withdraw all BUGS tokens from the contract
     * @param _receiverAddress Address to receive the withdrawn BUGS tokens
     */
    function withdrawSlotMachineBugs(address _receiverAddress) external onlyOwner notZeroAddress(_receiverAddress) {
        uint256 slotMachineBalance = IERC20(s_BugsContractAddress).balanceOf(address(this));
        IERC20(s_BugsContractAddress).transfer(_receiverAddress, slotMachineBalance);
    }

    /**
     * @notice Allows the owner to free a specific user and fund them with a specified amount
     * @param _userAddress Address of the user to free
     * @param _amount Amount of BUGS tokens to fund the user with
     */
    function freeUser(address _userAddress, uint256 _amount) external onlyOwner notZeroAddress(_userAddress) {
        s_UserAddressToIsWaiting[_userAddress] = false;
        s_UserAddressToLockBugs[_userAddress] = 0;
        if (_amount != 0) {
            uint256 slotMachineBalance = IERC20(s_BugsContractAddress).balanceOf(address(this));
            if (_amount > slotMachineBalance) {
                revert BridgeContract__GreaterThanSlotMachineBalance();
            }
            IERC20(s_BugsContractAddress).transfer(_userAddress, _amount);
        }
    }

    /*//////////////////////////////////////////////////////////////
                                User Accessible Functions
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Allows a user to deposit BUGS tokens into the contract
     * @param _bugsAmount Amount of BUGS tokens to deposit
     */
    function depositBugs(
        uint256 _bugsAmount
    ) external onlyOnce isGamePlayable amountCannotBeZero(_bugsAmount) nonReentrant{

        address userAddress = msg.sender;
        IERC20 bugs = IERC20(s_BugsContractAddress);

        uint256 userBugsBalance = bugs.balanceOf(userAddress);
        if (userBugsBalance < _bugsAmount) {
            revert BridgeContract__UserDoesNotHaveEnoughBugs();
        }

        uint256 userTotalApproval = bugs.allowance(userAddress, address(this));
        if (userTotalApproval < _bugsAmount) {
            revert BridgeContract__UserApprovalAmountIsNotSufficient();
        }

        bugs.transferFrom(userAddress, address(this), _bugsAmount);
        emit BugsDeposited(userAddress, _bugsAmount);

        bridgeCall(s_DepositMessageType, _bugsAmount, userAddress);
        s_UserAddressToIsWaiting[userAddress] = true;
        s_UserAddressToLockBugs[userAddress] += _bugsAmount;
    }

    /**
     * @notice Allows a user to withdraw all remaining BUGS tokens from the contract
     */
    function withdrawAllRemainingBugs() external onlyOnce nonReentrant{
        address userAddress = msg.sender;

        if (s_UserAddressToLockBugs[userAddress] == 0) {
            revert BridgeContract__UserDidNotLockBugs();
        }

        bridgeCall(s_WithdrawMessageType, 0, userAddress);
        s_UserAddressToIsWaiting[userAddress] = true;
    }

    /*//////////////////////////////////////////////////////////////
                                Bridge Only Function
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Confirms the execution of a call on the bridge
     * @param _messageType Type of the message (deposit or withdraw)
     * @param _amount Amount of BUGS tokens
     * @param _userAddress Address of the user
     */
    function callConfirmation(
        uint8 _messageType,
        uint256 _amount,
        address _userAddress
    ) external onlyCallerContract notZeroAddress(_userAddress) {

        if (_messageType == s_DepositMessageType) {
            s_UserAddressToIsWaiting[_userAddress] = false;
        } else if (_messageType == s_WithdrawMessageType) {
            settleWithdrawTransaction(_userAddress, _amount);
        } else {
            revert BridgeContract__MessageTypeDoesNotExist();
        }
        emit CallBackConfirmed(_userAddress);
    }

    /*//////////////////////////////////////////////////////////////
                                Internal-Private Functions
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Makes a bridge call to execute a function on the destination chain
     * @param _messageType Type of the message (deposit or withdraw)
     * @param _amount Amount of BUGS tokens
     * @param _userAddress Address of the user
     */
    function bridgeCall(
        uint8 _messageType,
        uint256 _amount,
        address _userAddress
    ) internal {
        ISlotMachine slotMachine = ISlotMachine(s_SlotMachineContractAddress);

        bytes memory callbackData = abi.encodePacked(this.callConfirmation.selector);

        IInterchainExecuteRouter(s_IexRouter).callRemote(
            s_DestinationDomain,
            address(slotMachine),
            0,
            abi.encodeCall(
                slotMachine.handle,
                (_messageType, _amount, _userAddress)
            ),
            callbackData
        );
    }

    /**
     * @notice Settles the withdrawal transaction for a user
     * @param _userAddress Address of the user
     * @param _amount Amount of BUGS tokens to withdraw
     */
    function settleWithdrawTransaction(
        address _userAddress,
        uint256 _amount
    ) internal {
        uint256 userLockedBugsAmount = s_UserAddressToLockBugs[_userAddress];
        uint256 slotMachineBalance = IERC20(s_BugsContractAddress).balanceOf(address(this));

        if (_amount > slotMachineBalance) {
            revert BridgeContract__GreaterThanSlotMachineBalance();
        }

        if (_amount > userLockedBugsAmount) {
            s_IsSlotMachineWorking = false;
        }

        if (_amount != 0) {
            IERC20(s_BugsContractAddress).transfer(_userAddress, _amount);
            emit BugsWithdrawn(_userAddress, _amount);
        }

        s_UserAddressToIsWaiting[_userAddress] = false;
        s_UserAddressToLockBugs[_userAddress] = 0;
    }

    /*//////////////////////////////////////////////////////////////
                             Getter Functions
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Gets the Interchain Account for a given contract
     * @param _contract Address of the contract
     * @return Address of the Interchain Account
     */
    function getICA(address _contract) external view returns (address) {
        return IInterchainExecuteRouter(s_IexRouter).getRemoteInterchainAccount(s_DestinationDomain, _contract);
    }

    /**
     * @notice Gets the SlotMachine contract address
     * @return Address of the SlotMachine contract
     */
    function getSlotMachineContractAddress() external view returns (address) {
        return s_SlotMachineContractAddress;
    }

    /**
     * @notice Gets the destination domain identifier
     * @return Destination domain identifier
     */
    function getDestinationDomain() external pure returns (uint32) {
        return s_DestinationDomain;
    }

    /**
     * @notice Gets the IexRouter address
     * @return Address of the IexRouter
     */
    function getIexRouter() external view returns (address) {
        return s_IexRouter;
    }

    /**
     * @notice Gets the BUGS token contract address
     * @return Address of the BUGS token contract
     */
    function getBugsContractAddress() external view returns (address) {
        return s_BugsContractAddress;
    }

    /**
     * @notice Gets the caller contract address
     * @return Address of the caller contract
     */
    function getCallerContract() external view returns (address) {
        return s_CallerContract;
    }

    /**
     * @notice Checks if a user is waiting
     * @param _userAddress Address of the user
     * @return True if the user is waiting, otherwise false
     */
    function isUserWaiting(address _userAddress) external view returns (bool) {
        return s_UserAddressToIsWaiting[_userAddress];
    }

    /**
     * @notice Gets the amount of locked BUGS tokens for a user
     * @param _userAddress Address of the user
     * @return Amount of locked BUGS tokens
     */
    function getUserLockedBugs(address _userAddress) external view returns (uint256) {
        return s_UserAddressToLockBugs[_userAddress];
    }

    /**
     * @notice Gets the deposit message type identifier
     * @return Deposit message type identifier
     */
    function getDepositMessageType() external pure returns (uint8) {
        return s_DepositMessageType;
    }

    /**
     * @notice Gets the withdraw message type identifier
     * @return Withdraw message type identifier
     */
    function getWithdrawMessageType() external pure returns (uint8) {
        return s_WithdrawMessageType;
    }
}

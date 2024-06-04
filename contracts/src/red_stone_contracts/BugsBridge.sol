// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;
import {IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/*//////////////////////////////////////////////////////////////
                           Interface
//////////////////////////////////////////////////////////////*/

interface IMailbox {
    function dispatch(
        uint32 _destinationDomain,
        bytes32 _recipientAddress,
        bytes calldata _messageBody
    ) external returns (bytes32);

    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _message
    ) external payable;
}

contract BugsBridge is ReentrancyGuard, Ownable, Initializable {
    /*//////////////////////////////////////////////////////////////
                                 STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    // Address of the SlotMachine contract on the Inco Network
    address private s_SlotMachineContractAddress;

    // Domain identifier for the Inco Network
    uint32 private constant s_DestinationDomain = 9090;

    // Address of the MailBox Contract on the RedStone Network
    address private s_MailBoxAddress;

    // ERC20 Contract Address for BUGS token
    address private s_BugsContractAddress;

    // Mapping of user addresses to their waiting status
    mapping(address => uint256) private s_UserAddressToLastWaitingTime;

    // Mapping of user addresses to the amount of locked BUGS tokens
    mapping(address => uint256) private s_UserAddressToLockBugs;

    // Indicates if the Slot Machine is operational
    bool private s_IsSlotMachineWorking;

    // Message type identifiers
    uint8 private constant s_DepositMessageType = 1;
    uint8 private constant s_WithdrawMessageType = 2;
    uint8 private constant s_BalanceUpdateMessageType = 3;

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event BugsDeposited(
        address indexed userAddress,
        uint256 indexed bugsAmount
    );
    event BugsWithdrawn(
        address indexed userAddress,
        uint256 indexed bugsAmount
    );
    event CallBackConfirmed(address indexed userAddress);

    /*//////////////////////////////////////////////////////////////
                                 Errors
    //////////////////////////////////////////////////////////////*/
    error BridgeContract__OnlyOwner();
    error BridgeContract__AlreadyInitialized();
    error BridgeContract__UserDoesNotHaveEnoughBugs();
    error BridgeContract__UserApprovalAmountIsNotSufficient();
    error BridgeContract__WaitingToGetResolved();
    error BridgeContract__OnlyMailBox();
    error BridgeContract__UserDidNotLockBugs();
    error BridgeContract__MessageTypeDoesNotExist();
    error BridgeContract__UserDidNotDepositSufficientBugs();
    error BridgeContract__SlotMachineIsNotWorking();
    error BridgeContract__AddressCannotBeZero();
    error BridgeContract__GreaterThanSlotMachineBalance();
    error BridgeContract__AmountCannotBeZero();
    error BridgeContract__WrongDomainId();
    error BridgeContract__OnlySlotMachine();
    error BridgeContract__HasNotBeenFailed();

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
        if (s_UserAddressToLastWaitingTime[msg.sender] != 0) {
            revert BridgeContract__WaitingToGetResolved();
        }
        _;
    }

    modifier onlyMailBox() {
        if (msg.sender != s_MailBoxAddress) {
            revert BridgeContract__OnlyMailBox();
        }
        _;
    }

    modifier amountCannotBeZero(uint256 _amount) {
        if (_amount == 0) {
            revert BridgeContract__AmountCannotBeZero();
        }
        _;
    }

    modifier onlyInco(uint32 _origin) {
        if (_origin != s_DestinationDomain) {
            revert BridgeContract__WrongDomainId();
        }
        _;
    }

    modifier onlySlotMachine(bytes32 _senderAddress) {
        if (bytes32ToAddress(_senderAddress) != s_SlotMachineContractAddress) {
            revert BridgeContract__OnlySlotMachine();
        }
        _;
    }

    modifier onlyIfBridgeFails() {
        if (
            block.timestamp <
            s_UserAddressToLastWaitingTime[msg.sender] + 5 minutes
        ) {
            revert BridgeContract__HasNotBeenFailed();
        }
        _;
    }

    constructor() Ownable(msg.sender) {}

    /*//////////////////////////////////////////////////////////////
                                Owner Only Functions
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Initializes the contract with necessary addresses
     * @param _mailBoxAddress Address of the MailBox contract
     * @param _slotMachineContractAddress Address of the SlotMachine contract
     * @param _bugsContractAddress Address of the BUGS token contract
     */

    function initialize(
        address _mailBoxAddress,
        address _slotMachineContractAddress,
        address _bugsContractAddress
    ) external onlyOwner initializer {
        s_MailBoxAddress = _mailBoxAddress;
        s_BugsContractAddress = _bugsContractAddress;
        s_SlotMachineContractAddress = _slotMachineContractAddress;
        s_IsSlotMachineWorking = true;
    }

    /**
     * @notice Updates the owner address
     * @param _newOwnerAddress New owner address
     */
    function updateOwnerAddress(address _newOwnerAddress)
        external
        onlyOwner
        notZeroAddress(_newOwnerAddress)
    {
        transferOwnership(_newOwnerAddress);
    }

    /**
     * @notice Updates the MailBox address
     * @param _newMailBoxAddress New MailBox address
     */
    function updateMailBoxAddress(address _newMailBoxAddress)
        external
        onlyOwner
        notZeroAddress(_newMailBoxAddress)
    {
        s_MailBoxAddress = _newMailBoxAddress;
    }

    /**
     * @notice Updates the SlotMachine contract address
     * @param _newSlotMachineAddress New SlotMachine contract address
     */
    function updateSlotMachineAddress(address _newSlotMachineAddress)
        external
        onlyOwner
        notZeroAddress(_newSlotMachineAddress)
    {
        s_SlotMachineContractAddress = _newSlotMachineAddress;
    }

    /**
     * @notice Allows the owner to withdraw all BUGS tokens from the contract
     * @param _receiverAddress Address to receive the withdrawn BUGS tokens
     */
    function withdrawSlotMachineBugs(address _receiverAddress)
        external
        onlyOwner
        notZeroAddress(_receiverAddress)
    {
        uint256 slotMachineBalance = IERC20(s_BugsContractAddress).balanceOf(
            address(this)
        );
        IERC20(s_BugsContractAddress).transfer(
            _receiverAddress,
            slotMachineBalance
        );
    }

    /**
     * @notice Allows the owner to set the operational status of the slot machine
     * @param _bool Boolean value indicating whether the slot machine should be working (true) or not (false)
     */
    function setSlotMachineWorkingStatus(bool _bool) external onlyOwner {
        s_IsSlotMachineWorking = _bool;
    }

    /*//////////////////////////////////////////////////////////////
                                User Accessible Functions
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Allows a user to deposit BUGS tokens into the contract
     * @param _bugsAmount Amount of BUGS tokens to deposit
     */
    function depositBugs(uint256 _bugsAmount)
        external
        onlyOnce
        isGamePlayable
        amountCannotBeZero(_bugsAmount)
        nonReentrant
    {
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
        s_UserAddressToLastWaitingTime[userAddress] = block.timestamp;
        s_UserAddressToLockBugs[userAddress] += _bugsAmount;
    }

    /**
     * @notice Allows a user to withdraw all remaining BUGS tokens from the contract
     */
    function withdrawBugs() external onlyOnce nonReentrant {
        address userAddress = msg.sender;

        if (s_UserAddressToLockBugs[userAddress] == 0) {
            revert BridgeContract__UserDidNotLockBugs();
        }

        bridgeCall(s_WithdrawMessageType, 0, userAddress);
        s_UserAddressToLastWaitingTime[userAddress] = block.timestamp;
    }

    function forceWithDrawl() external onlyIfBridgeFails {
        uint256 _userLockedBugs = s_UserAddressToLockBugs[msg.sender];
        if (_userLockedBugs == 0) {
            revert BridgeContract__AmountCannotBeZero();
        }
        IERC20(s_BugsContractAddress).transfer(msg.sender, _userLockedBugs);
        s_UserAddressToLastWaitingTime[msg.sender] = 0;
        s_UserAddressToLockBugs[msg.sender] = 0;
        emit BugsWithdrawn(msg.sender, _userLockedBugs);
    }

    /*//////////////////////////////////////////////////////////////
                                Bridge Only Function
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice This function is only called by Mailbox Confirms the execution of a call on the bridge and reduces the balance of user on each spin on Inco
     * @param _origin Where the call was initiated
     * @param _sender the sender of the data
     * @param _message The Data which is being sent
     */
    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes memory _message
    ) external onlyMailBox onlyInco(_origin) onlySlotMachine(_sender) {
        (uint8 _messageType, uint256 _amount, address _userAddress) = abi
            .decode(_message, (uint8, uint256, address));

        if (_messageType == s_DepositMessageType) {
            s_UserAddressToLastWaitingTime[_userAddress] = 0;
        } else if (_messageType == s_WithdrawMessageType) {
            settleWithdrawTransaction(_userAddress, _amount);
        } else if (_messageType == s_BalanceUpdateMessageType) {
            s_UserAddressToLockBugs[_userAddress] -= _amount;
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
        IMailbox(s_MailBoxAddress).dispatch(
            s_DestinationDomain,
            addressToBytes32(s_SlotMachineContractAddress),
            abi.encode(_messageType, _amount, _userAddress)
        );
    }

    /**
     * @notice Settles the withdrawal transaction for a user
     * @param _userAddress Address of the user
     * @param _amount Amount of BUGS tokens to withdraw
     */
    function settleWithdrawTransaction(address _userAddress, uint256 _amount)
        internal
    {
        uint256 userLockedBugsAmount = s_UserAddressToLockBugs[_userAddress];
        uint256 slotMachineBalance = IERC20(s_BugsContractAddress).balanceOf(
            address(this)
        );

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

        s_UserAddressToLastWaitingTime[_userAddress] = 0;
        s_UserAddressToLockBugs[_userAddress] = 0;
    }

    /*//////////////////////////////////////////////////////////////
                             Getter Functions
    //////////////////////////////////////////////////////////////*/

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
     * @notice Gets the MailBox address
     * @return Address of the MailBoxAddress
     */
    function getMailBoxAddress() external view returns (address) {
        return s_MailBoxAddress;
    }

    /**
     * @notice Gets the BUGS token contract address
     * @return Address of the BUGS token contract
     */
    function getBugsContractAddress() external view returns (address) {
        return s_BugsContractAddress;
    }

    /**
     * @notice Checks if a user is waiting
     * @param _userAddress Address of the user
     * @return True if the user is waiting, otherwise false
     */
    function isUserWaiting(address _userAddress) external view returns (bool) {
        if (s_UserAddressToLastWaitingTime[_userAddress] == 0) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * @notice Gets the amount of locked BUGS tokens for a user
     * @param _userAddress Address of the user
     * @return Amount of locked BUGS tokens
     */
    function getUserLockedBugs(address _userAddress)
        external
        view
        returns (uint256)
    {
        return s_UserAddressToLockBugs[_userAddress];
    }

    /**
     * @notice Gets the amount of locked BUGS tokens for a user
     * @return Working status of slot machine
     */
    function getSlotMachineStatus() external view returns(bool){
        return s_IsSlotMachineWorking;
    }

    /**
     * @notice Converts an address to a bytes32 type, preserving alignment
     * @param _addr The address to be converted
     * @return The bytes32 representation of the address
     */
    function addressToBytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }

    /**
     * @notice Converts a bytes32 type back to an address, preserving alignment
     * @param _buf The bytes32 value to be converted
     * @return The address representation of the bytes32 value
     */
    function bytes32ToAddress(bytes32 _buf) internal pure returns (address) {
        return address(uint160(uint256(_buf)));
    }
}

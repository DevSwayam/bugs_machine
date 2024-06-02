// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@fhevm/TFHE.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

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

contract SlotMachine {
    using ECDSA for bytes32;

    /*//////////////////////////////////////////////////////////////
                                 STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    // The owner's address who has administrative control over the contract.
    address private i_Owner;

    // The server's address responsible for executing EIP712 signed transactions.
    address private s_ServerAddress;

    // A mapping to store the amount of points held by each user.
    mapping(address => uint256) private s_UserAddressToPoints;

    // The charge (in points) required for each spin of the slot machine.
    uint256 private s_SpinCharge = 100 * 10**18;

    // The domain identifier for the destination where the BUGS (tokens/points) are locked for the game to be playable.
    uint32 private constant s_DestinationDomain = 17069;

    // The address of the Mailbox contract for handling cross-chain communication.
    address private s_MailBoxAddress;

    // Address of the Bugs Bridge Contract Address
    address private s_BugsBridgeContractAddress;

    // The initial balance of the slot machine to be funded when the contract is deployed.
    uint256 private constant s_SlotMachineInititalBalance = 5000 * 10**18;

    // The current balance of the slot machine, which grows as players spin the machine.
    uint256 private s_SlotMachineBalance;

    // The winning number that acts as the lucky number in the slot machine game.
    euint8 private s_WinningNumber;

    // The chain ID of the blockchain where this contract is deployed.
    uint256 private immutable s_ExecutionChainId = block.chainid;

    // A boolean flag to check whether the slot machine game is currently playable or not.
    bool private s_IsSlotMachineWorking;

    // Spin Type Hash for Signature verification
    bytes32 private constant SPIN_TYPE_HASH =
        keccak256(
            "Spin(address user,uint256 expiration,uint256 chainId,uint256 executionChainId)"
        );

    // Domain Seperator which will be set on Deployment
    bytes32 private immutable DOMAIN_SEPARATOR;

    // Message type identifiers
    uint8 private constant s_DepositMessageType = 1;
    uint8 private constant s_WithdrawMessageType = 2;
    uint8 private constant s_BalanceUpdateMessageType = 3;

    /*//////////////////////////////////////////////////////////////
                                 Events
    //////////////////////////////////////////////////////////////*/
    event BetPlaced(address indexed userAddress, bool isWinner);
    event CallReceived(address indexed userAddress);
    /*//////////////////////////////////////////////////////////////
                                 Errors
    //////////////////////////////////////////////////////////////*/

    error SlotMachine__onlyOwner();
    error SlotMachine__onlyMailBox();
    error SlotMachine__addressCannotBeZero();
    error SlotMachine__OnlyServer();
    error SlotMachine__InsufficientPoints();
    error SlotMachine__MessageTypeDoesNotExist();
    error SlotMachine__InvalidSignature();
    error SlotMachine__SignatureExpired();
    error SlotMachine__InvalidChainId();
    error SlotMachine__InvalidExecutionChainId();
    error SlotMachine__UserDoesNotHaveEnoughBalance();
    error SlotMachine__SlotMachineIsNotWorking();
    error SlotMachine__InvalidSender();

    /*//////////////////////////////////////////////////////////////
                               MODIFIERS
    //////////////////////////////////////////////////////////////*/

    modifier onlyServer() {
        if (msg.sender != s_ServerAddress) {
            revert SlotMachine__OnlyServer();
        }
        _;
    }

    modifier onlyOwner() {
        if (msg.sender != i_Owner) {
            revert SlotMachine__onlyOwner();
        }
        _;
    }

    modifier onlyMailBox() {
        if (msg.sender != s_MailBoxAddress) {
            revert SlotMachine__onlyMailBox();
        }
        _;
    }

    modifier hasEnoughPoints(address userAddress) {
        if (s_UserAddressToPoints[userAddress] < s_SpinCharge) {
            revert SlotMachine__InsufficientPoints();
        }
        _;
    }

    modifier isGamePlayable() {
        if (!s_IsSlotMachineWorking) {
            revert SlotMachine__SlotMachineIsNotWorking();
        }
        _;
    }

    modifier onlyRedStone(uint32 _origin) {
        if (_origin != s_DestinationDomain) {
            revert SlotMachine__InvalidChainId();
        }
        _;
    }

    modifier onlyBugsBridge(bytes32 _sender) {
        if (bytes32ToAddress(_sender) != s_BugsBridgeContractAddress) {
            revert SlotMachine__InvalidSender();
        }
        _;
    }

    /*//////////////////////////////////////////////////////////////
                                Constructor
    //////////////////////////////////////////////////////////////*/

    constructor() {
        i_Owner = msg.sender;
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                keccak256(bytes("SlotMachine")),
                keccak256(bytes("1")),
                s_DestinationDomain,
                address(this)
            )
        );
        s_WinningNumber = TFHE.randEuint8();
        s_SlotMachineBalance = s_SlotMachineInititalBalance;
    }

    /*//////////////////////////////////////////////////////////////
                                External Functions
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Initializes the slot machine contract with necessary addresses and sets it to operational
     * @param _bugsBridgeContractAddress The address of the Bugs Bridge contract on Red Stone
     * @param _mailBoxAddress The address of the Mailbox contract
     * @param _serverAddress The address of the server
     */
    function initialize(
        address _bugsBridgeContractAddress,
        address _mailBoxAddress,
        address _serverAddress
    ) external onlyOwner {
        if (
            _mailBoxAddress == address(0) ||
            _serverAddress == address(0) ||
            _bugsBridgeContractAddress == address(0)
        ) {
            revert SlotMachine__addressCannotBeZero();
        }
        s_BugsBridgeContractAddress = _bugsBridgeContractAddress;
        s_MailBoxAddress = _mailBoxAddress;
        s_ServerAddress = _serverAddress;
        s_IsSlotMachineWorking = true;
    }

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
            addressToBytes32(s_BugsBridgeContractAddress),
            abi.encode(_messageType, _amount, _userAddress)
        );
    }

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
    ) external onlyMailBox onlyRedStone(_origin) onlyBugsBridge(_sender) {
        (uint8 _messageType, uint256 _amount, address _userAddress) = abi
            .decode(_message, (uint8, uint256, address));

        if (_messageType == s_DepositMessageType) {
            s_UserAddressToPoints[_userAddress] += _amount;
            bridgeCall(
                s_DepositMessageType,
                s_UserAddressToPoints[_userAddress],
                _userAddress
            );
        } else if (_messageType == s_WithdrawMessageType) {
            bridgeCall(
                s_WithdrawMessageType,
                s_UserAddressToPoints[_userAddress],
                _userAddress
            );
            s_UserAddressToPoints[_userAddress] = 0;
        } else {
            revert SlotMachine__MessageTypeDoesNotExist();
        }
        emit CallReceived(_userAddress);
    }

    /**
     * @notice Allows a user to spin the slot machine if they have enough points and the game is playable
     * @param _userAddress The address of the user spinning the slot machine
     * @param expiration The expiration time of the spin request
     * @param chainId The chain ID for the request
     * @param executionChainId The execution chain ID for the request
     * @param signature The signature of the spin request
     */
    function spinSlotMachine(
        address _userAddress,
        uint256 expiration,
        uint256 chainId,
        uint256 executionChainId,
        bytes memory signature
    ) external hasEnoughPoints(_userAddress) onlyServer isGamePlayable {
        bytes32 structHash = keccak256(
            abi.encode(
                SPIN_TYPE_HASH,
                _userAddress,
                expiration,
                chainId,
                executionChainId
            )
        );

        bytes32 hash = keccak256(
            abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, structHash)
        );
        address recoveredAddress = hash.recover(signature);

        // All the Checks before Interaction
        if (chainId != s_DestinationDomain) {
            revert SlotMachine__InvalidChainId();
        }

        // Ensure the executionChainId is correct
        if (executionChainId != s_ExecutionChainId) {
            revert SlotMachine__InvalidExecutionChainId();
        }

        if (recoveredAddress != _userAddress) {
            revert SlotMachine__InvalidSignature();
        }

        if (block.timestamp > expiration) {
            revert SlotMachine__SignatureExpired();
        }

        s_SlotMachineBalance += s_SpinCharge;
        s_UserAddressToPoints[_userAddress] -= s_SpinCharge;
        euint8 _randomNumber = TFHE.randEuint8();
        ebool _eChoice = TFHE.eq(_randomNumber, s_WinningNumber);
        bool _isWinner = TFHE.decrypt(_eChoice);
        bridgeCall(s_BalanceUpdateMessageType, s_SpinCharge, _userAddress);
        if (_isWinner) {
            s_UserAddressToPoints[_userAddress] += s_SlotMachineBalance;
            s_SlotMachineBalance = s_SlotMachineInititalBalance;
            s_IsSlotMachineWorking = false;
        }
        emit BetPlaced(_userAddress, _isWinner);
    }

    /**
     * @notice Allows the owner to set the operational status of the slot machine
     * @param _bool Boolean value indicating whether the slot machine should be working (true) or not (false)
     */
    function setSlotMachineWorkingStatus(bool _bool) external onlyOwner {
        s_IsSlotMachineWorking = _bool;
    }

    /*//////////////////////////////////////////////////////////////
                             Getter Functions
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Gets the owner address
     * @return Owner address
     */
    function getOwner() external view returns (address) {
        return i_Owner;
    }

    /**
     * @notice Gets the BridgeContract address
     * @return BridgeContract address
     */
    function getMailBoxAddress() external view returns (address) {
        return s_MailBoxAddress;
    }

    /**
     * @notice Gets the Server address
     * @return Server address
     */
    function getServerAddress() external view returns (address) {
        return s_ServerAddress;
    }

    /**
     * @notice Gets the points of a user
     * @param _userAddress Address of the user
     * @return Points of the user
     */
    function getUserPoints(address _userAddress)
        external
        view
        returns (uint256)
    {
        return s_UserAddressToPoints[_userAddress];
    }

    /**
     * @notice Gets the SpinCharge
     * @return SpinCharge amount
     */
    function getSpinCharge() external view returns (uint256) {
        return s_SpinCharge;
    }

    /**
     * @notice Gets the DestinationDomain
     * @return DestinationDomain identifier
     */
    function getDestinationDomain() external pure returns (uint32) {
        return s_DestinationDomain;
    }

    /**
     * @notice Gets the SlotMachineBalance
     * @return SlotMachineBalance amount
     */
    function getSlotMachineBalance() external view returns (uint256) {
        return s_SlotMachineBalance;
    }

    /**
     * @notice Checks if the SlotMachine is working
     * @return True if the SlotMachine is working, otherwise false
     */
    function isSlotMachineWorking() external view returns (bool) {
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

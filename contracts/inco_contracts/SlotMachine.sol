// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import "fhevm/lib/TFHE.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

interface ISlotMachine {
    function handle(
        uint8 _messageType,
        uint256 _amount,
        address _userAddress
    ) external returns (uint8, uint256, address);
}

contract SlotMachine is ISlotMachine {
    using ECDSA for bytes32;

    /*//////////////////////////////////////////////////////////////
                                 STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    // The owner's address who has administrative control over the contract.
    address private i_Owner;

    // The address of the bridge contract deployed on this chain as an Inter-Chain Application (ICA).
    address private s_BridgeContractAddress;

    // The server's address responsible for executing EIP712 signed transactions.
    address private s_ServerAddress;

    // A mapping to store the amount of points held by each user.
    mapping(address => uint256) private s_UserAddressToPoints;

    // The charge (in points) required for each spin of the slot machine.
    uint256 private s_SpinCharge = 100 * 10 ** 18;

    // The domain identifier for the destination where the BUGS (tokens/points) are locked for the game to be playable.
    uint32 private s_DestinationDomain;

    // The address of the IEX Router on this chain for handling cross-chain communication.
    address private s_IexRouter;

    // The initial balance of the slot machine to be funded when the contract is deployed.
    uint256 private constant s_SlotMachineInititalBalance = 5000 * 10 ** 18;

    // The current balance of the slot machine, which grows as players spin the machine.
    uint256 private s_SlotMachineBalance;

    // The winning number that acts as the lucky number in the slot machine game.
    euint8 private s_WinningNumber;

    // The destination chain ID used to create the domain separator for EIP712 signatures.
    uint256 private constant s_ChainId = 17001;

    // The chain ID of the blockchain where this contract is deployed.
    uint256 private constant s_ExecutionChainId = block.chainid;

    // A boolean flag to check whether the slot machine game is currently playable or not.
    bool private s_IsSlotMachineWorking;

    // Spin Type Hash for Signature verification
    bytes32 private constant SPIN_TYPEHASH =
        keccak256(
            "Spin(address user,uint256 expiration,uint256 chainId,uint256 executionChainId)"
        );
    
    // Domain Seperator which will be set on Deployment
    bytes32 private immutable DOMAIN_SEPARATOR;

    /*//////////////////////////////////////////////////////////////
                                 Events
    //////////////////////////////////////////////////////////////*/
    event BetPlaced(address indexed userAddress, bool isWinner);

    /*//////////////////////////////////////////////////////////////
                                 Errors
    //////////////////////////////////////////////////////////////*/

    error SlotMachine__onlyOwner();
    error SlotMachine__onlyBridgeContract();
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
    error SlotMachine__addressCannotBeZero();

    /*//////////////////////////////////////////////////////////////
                               MODIFIERS
    //////////////////////////////////////////////////////////////*/

    modifier _onlyServer() {
        if (msg.sender != s_ServerAddress) {
            revert SlotMachine__OnlyServer();
        }
        _;
    }

    modifier _onlyOwner() {
        if (msg.sender != i_Owner) {
            revert SlotMachine__onlyOwner();
        }
        _;
    }

    modifier _onlyBridge() {
        if (msg.sender != s_BridgeContractAddress) {
            revert SlotMachine__onlyBridgeContract();
        }
        _;
    }

    modifier _hasEnoughPoints(address userAddress) {
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
                s_ChainId,
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
     * @param _DestinationDomain The domain identifier for the destination
     * @param _bridgeContract The address of the bridge contract
     * @param _iexRouter The address of the IEX router
     * @param _serverAddress The address of the server
     */
    function initialize(
        uint32 _DestinationDomain,
        address _bridgeContract,
        address _iexRouter,
        address _serverAddress
    ) external _onlyOwner {
        if (
            _bridgeContract == address(0) ||
            _iexRouter == address(0) ||
            _serverAddress == address(0)
        ) {
            revert SlotMachine__addressCannotBeZero();
        }
        s_DestinationDomain = _DestinationDomain;
        s_IexRouter = _iexRouter;
        s_BridgeContractAddress = _bridgeContract;
        s_ServerAddress = _serverAddress;
        s_IsSlotMachineWorking = true;
    }

    /**
     * @notice Handles messages from the bridge contract to update user points
     * @param _messageType The type of message (1 for adding points, 2 for resetting points)
     * @param _amount The amount of points to be added or returned
     * @param _userAddress The address of the user whose points are being updated
     * @return The message type, amount processed, and user address
     */
    function handle(
        uint8 _messageType,
        uint256 _amount,
        address _userAddress
    ) external _onlyBridge returns (uint8, uint256, address) {
        if (_messageType == 1) {
            s_UserAddressToPoints[_userAddress] += _amount;
            return (_messageType, _amount, _userAddress);
        } else if (_messageType == 2) {
            uint256 _remainingUserBalance = s_UserAddressToPoints[_userAddress];
            s_UserAddressToPoints[_userAddress] = 0;
            return (_messageType, _remainingUserBalance, _userAddress);
        } else {
            revert SlotMachine__MessageTypeDoesNotExist();
        }
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
    ) external _hasEnoughPoints(_userAddress) _onlyServer isGamePlayable {
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
        if (chainId != s_ChainId) {
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
        euint16 _randomNumber = TFHE.randEuint8();
        ebool _eChoice = TFHE.eq(_randomNumber, s_WinningNumber);
        bool _isWinner = TFHE.decrypt(_eChoice);

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
    function setSlotMachineWorkingStatus(bool _bool) external _onlyOwner {
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
    function getBridgeContractAddress() external view returns (address) {
        return s_BridgeContractAddress;
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
    function getUserPoints(
        address _userAddress
    ) external view returns (uint256) {
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
    function getDestinationDomain() external view returns (uint32) {
        return s_DestinationDomain;
    }

    /**
     * @notice Gets the IexRouter address
     * @return IexRouter address
     */
    function getIexRouterAddress() external view returns (address) {
        return s_IexRouter;
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
}

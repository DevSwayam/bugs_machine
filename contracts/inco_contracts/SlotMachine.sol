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

    address public immutable i_Owner;
    address public s_BridgeContractAddress;
    address public s_ServerAddress;
    mapping(address => uint256) public s_UserAddressToPoints;
    uint256 public s_SpinCharge = 2 * 10 ** 18;
    uint32 public s_DestinationDomain;
    address public s_IexRouter;
    uint256 public s_SlotMachineBalance = 5000 * 10 ** 18;
    euint16 public s_WinningNumber = TFHE.randEuint16();

    bytes32 public constant SPIN_TYPEHASH = keccak256("Spin(address user,uint256 expiration,uint256 chainId,uint256 executionChainId)");
    bytes32 public DOMAIN_SEPARATOR;

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

    event BetPlaced(address indexed userAddress, bool isWinner);

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

    /*//////////////////////////////////////////////////////////////
                                Constructor
    //////////////////////////////////////////////////////////////*/

    constructor() {
        i_Owner = msg.sender;
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("SlotMachine")),
                keccak256(bytes("1")),
                17001,
                address(this)
            )
        );
    }

    /*//////////////////////////////////////////////////////////////
                                External Functions
    //////////////////////////////////////////////////////////////*/

    function initialize(
        uint32 _DestinationDomain,
        address _bridgeContract,
        address _iexRouter,
        address _serverAddress
    ) external _onlyOwner {
        s_DestinationDomain = _DestinationDomain;
        s_IexRouter = _iexRouter;
        s_BridgeContractAddress = _bridgeContract;
        s_ServerAddress = _serverAddress;
    }

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

    function spinSlotMachine(
    address _userAddress,
    uint256 expiration,
    uint256 chainId,
    uint256 executionChainId,
    bytes memory signature
) external _hasEnoughPoints(_userAddress) _onlyServer {
    // Ensure the chainId is correct
    if (chainId != 17001) {
        revert SlotMachine__InvalidChainId();
    }

    // Ensure the executionChainId is correct
    if (executionChainId != 9090) {
        revert SlotMachine__InvalidExecutionChainId();
    }

    // Verify the signature
    bytes32 structHash = keccak256(abi.encode(SPIN_TYPEHASH, _userAddress, expiration, chainId, executionChainId));
    bytes32 hash = keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, structHash));
    address recoveredAddress = hash.recover(signature);

    if (recoveredAddress != _userAddress) {
        revert SlotMachine__InvalidSignature();
    }

    if (block.timestamp > expiration) {
        revert SlotMachine__SignatureExpired();
    }

    s_SlotMachineBalance += s_SpinCharge;
    s_UserAddressToPoints[_userAddress] -= s_SpinCharge;
    euint16 _randomNumber = TFHE.randEuint16();
    ebool _eChoice = TFHE.eq(_randomNumber, s_WinningNumber);
    bool _isWinner = TFHE.decrypt(_eChoice);

    if (_isWinner) {
        s_UserAddressToPoints[_userAddress] += s_SlotMachineBalance;
    }
    emit BetPlaced(_userAddress, _isWinner);
}


}

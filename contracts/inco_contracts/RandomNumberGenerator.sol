// SPDX-License-Identifier: BSD-3-Clause-Clear


pragma solidity >=0.8.13 <0.9.0;

import "fhevm/lib/TFHE.sol";

    /*//////////////////////////////////////////////////////////////
                            INTERFACE
    //////////////////////////////////////////////////////////////*/

    interface ISlotMachine {
        function handle(uint16 _randomNumber,uint256 _uniqueId,address _userAddress) external;
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


contract RandomNumberGenerator {

    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/
    // The Allowed caller Server which can send random numbers 
    address private s_CallerServer;

    // Address of Slot Machine contract on RedStone Network
    address private s_SlotMachineContractAddress;

    // Domain for Red Stone Network
    uint32 private s_DestinationDomain;

    // Interchain Account Router Contract Deployed on Inco Network
    address private s_IcaRouterAddress;

    // EOA address of owner for intialisation of contract
    address immutable i_Owner;

    // Users address to their last random Number
    mapping(address userAddress => uint16 lastRandomNumber) private s_userAddressToLastRandomNumber;

    // For initialising contract only Once
    bool private s_IsInitialised;


    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/
    event randomNumberGenerated(
        uint16 indexed number,
        uint256 indexed uniqueId,
        address indexed user
    );


    /*//////////////////////////////////////////////////////////////
                                 Errors
    //////////////////////////////////////////////////////////////*/
    error RandomNumberGenerator__onlyServer();
    error RandomNumberGenerator__onlyOwmer();
    error RandomNumberGenerator__alreadyInitialised();


    /*//////////////////////////////////////////////////////////////
                               MODIFIERS
    //////////////////////////////////////////////////////////////*/
     modifier _onlyOwner() {
        if (msg.sender != i_Owner) {
            revert RandomNumberGenerator__onlyOwmer();
        }
        _;
    }
    
    modifier _onlyServer() {
        if (msg.sender != s_CallerServer) {
            revert RandomNumberGenerator__onlyServer();
        }
        _;
    }

    modifier _isInitialised() {
        if (s_IsInitialised) {
            revert RandomNumberGenerator__alreadyInitialised();
        }
        _;
    }

    /*//////////////////////////////////////////////////////////////
                                Constructor
    //////////////////////////////////////////////////////////////*/
    constructor(){
        i_Owner = msg.sender;
    }

    /*//////////////////////////////////////////////////////////////
                                External Functions
    //////////////////////////////////////////////////////////////*/

    function initialize(
        uint32 _destinationDomain,
        address _slotMachineContractAddress,
        address _icaRouterAddress,
        address _callerServer
    ) external _onlyOwner _isInitialised{
        s_DestinationDomain = _destinationDomain;
        s_SlotMachineContractAddress = _slotMachineContractAddress;
        s_IcaRouterAddress = _icaRouterAddress;
        s_CallerServer = _callerServer;
        s_IsInitialised = true;
    }

    function setServerContract(address _newServerAddress) external _onlyOwner{
        s_CallerServer = _newServerAddress;
    }

    function sendRandomNumber(address _userAddress) external _onlyServer {
        ISlotMachine _slotMachine = ISlotMachine(s_SlotMachineContractAddress);
        uint256 _uniqueId = getUniqueId(_userAddress);
        uint16 _randomNumber = TFHE.decrypt(TFHE.randEuint16());
        s_userAddressToLastRandomNumber[_userAddress] = _randomNumber; 
        IInterchainAccountRouter(s_IcaRouterAddress).callRemote(
            s_DestinationDomain,
            address(s_SlotMachineContractAddress),
            0,
            abi.encodeCall(_slotMachine.handle, (_randomNumber,_uniqueId,_userAddress))
        );
        emit randomNumberGenerated(_randomNumber, _uniqueId, _userAddress);
    }

    /*//////////////////////////////////////////////////////////////
                               Getter Functions
    //////////////////////////////////////////////////////////////*/

    function getDestinationDomain() external view returns (uint32) {
        return s_DestinationDomain;
    }

    function getCallerServerAddress() external view returns (address) {
        return s_CallerServer;
    }

    function getUniqueId(address _userAdddress) internal view returns(uint256){
        bytes32 _userHash = keccak256(abi.encodePacked(_userAdddress));
        uint256 _uniqueID = uint256(
            keccak256(abi.encodePacked(block.timestamp, _userHash))
        );
        return(_uniqueID);
    }

    function getICA(address _contractAddress) public view returns(address) {
        return IInterchainAccountRouter(s_IcaRouterAddress).getRemoteInterchainAccount(s_DestinationDomain, _contractAddress);
    }

    function getOwnersAddress() external view returns (address) {
        return i_Owner;
    }

    function getUserAddressToLastRandonNumber(address _user)
        external
        view
        returns (uint256)
    {
        return s_userAddressToLastRandomNumber[_user];
    }

    function getSlotMachineContractAddress() external view returns (address) {
        return s_SlotMachineContractAddress;
    }

    function getIcaRouterAddress() external view returns (address){
        return s_IcaRouterAddress;
    }

}
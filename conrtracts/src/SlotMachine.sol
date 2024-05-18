// SPDX-License-Identifier: Apache-2.0

/* 
This contract is an example contract to demonstrate 
the cross-chain function call using ExcuteAPI 
on the Red Stone Network.
*/

pragma solidity >=0.8.13 <0.9.0;

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

interface IRandomNumberGenerator {
    function returnRandomNumber() external returns (uint16);
}

contract SlotMachine {

    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    // Domain for Inco Network
    uint32 private s_destinationDomain;

    // EOA address of owner for intialisation of contract
    address private immutable i_owner;

    // Address of Random number generating contract
    address private s_rngContractAddress;

    // Interchain Exchange Router Contract Deployed on Red Stone
    address private s_iexRouter;

    // The Allowed caller Contract which can call callback functions
    address private s_caller_contract;

    // Users Address to unique Id mapping for calls
    mapping(address => uint256) private s_addressToCallId;

    // Users Unique ID to their Address
    mapping(uint256 => address) private s_callIdToAddress;

    // Users address to their last random Number
    mapping(address => uint16) private s_addressToLastRandomNumber;

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
    error SlotMachine__onlyOwmer();
    error SlotMachine__onlyCalllerContract();
    error SlotMachine__waitingForLastRandomNumber();

    /*//////////////////////////////////////////////////////////////
                               MODIFIERS
    //////////////////////////////////////////////////////////////*/
    modifier _onlyOwner() {
        if (msg.sender != i_owner) {
            revert SlotMachine__onlyOwmer();
        }
        _;
    }

    modifier _onlyCallerContract() {
        if (msg.sender != s_caller_contract) {
            revert SlotMachine__onlyCalllerContract();
        }
        _;
    }

    modifier _onlyOneCallPerUser() {
        if (s_addressToCallId[msg.sender] != 0) {
            revert SlotMachine__waitingForLastRandomNumber();
        }
        _;
    }

    /*//////////////////////////////////////////////////////////////
                                Constructor
    //////////////////////////////////////////////////////////////*/

    constructor() {
        i_owner = msg.sender;
    }

    /*//////////////////////////////////////////////////////////////
                                External Functions
    //////////////////////////////////////////////////////////////*/

    function initialize(
        uint32 _destinationDomain,
        address _randomNumberContractAddress,
        address _iexRouter,
        address _caller_contract
    ) external _onlyOwner {
        s_destinationDomain = _destinationDomain;
        s_rngContractAddress = _randomNumberContractAddress;
        s_iexRouter = _iexRouter;
        s_caller_contract = _caller_contract;
    }

    function GetNumber() external _onlyOneCallPerUser {
        IRandomNumberGenerator _randomNumberGeneratotContract = IRandomNumberGenerator(s_rngContractAddress);

        address _user = msg.sender;

        // Hashing users address and current block.timestamp to get unique id
        bytes32 _userHash = keccak256(abi.encodePacked(_user));
        uint256 _uniqueID = uint256(
            keccak256(abi.encodePacked(block.timestamp, _userHash))
        );

        s_addressToCallId[msg.sender] = _uniqueID;
        s_callIdToAddress[_uniqueID] = msg.sender;

        bytes memory _callback = abi.encodePacked(
            this.spinSlotMachine.selector,
            _uniqueID
        );

        IInterchainExecuteRouter(s_iexRouter).callRemote(
            s_destinationDomain,
            address(_randomNumberGeneratotContract),
            0,
            abi.encodeCall(_randomNumberGeneratotContract.returnRandomNumber,()),
            _callback
        );
    }

    function spinSlotMachine(uint256 _uniqueId, uint16 _randomNumber)
        external
        _onlyCallerContract
    {
        address _user = getCallIdToUserAddress(_uniqueId);
        s_addressToLastRandomNumber[_user] = _randomNumber;
        s_addressToCallId[_user] = 0;
        s_callIdToAddress[_uniqueId] = address(0);
        emit randomNumberGenerated(_randomNumber, _uniqueId, _user);
    }

    /*//////////////////////////////////////////////////////////////
                               Getter Functions
    //////////////////////////////////////////////////////////////*/

    function getDestinationDomain() external view returns (uint32) {
        return s_destinationDomain;
    }

    function getOwnersAddress() external view returns (address) {
        return i_owner;
    }

    function getRngContractAddress() external view returns (address) {
        return s_rngContractAddress;
    }

    function getCallerContractAddress() external view returns (address) {
        return s_caller_contract;
    }

    function getUserAddressToCallId(address _user)
        external
        view
        returns (uint256)
    {
        return s_addressToCallId[_user];
    }

    function getCallIdToUserAddress(uint256 _uniqueId)
        public
        view
        returns (address)
    {
        return s_callIdToAddress[_uniqueId];
    }

    function getUserAddressToLastRandonNumber(address _user)
        external
        view
        returns (uint256)
    {
        return s_addressToLastRandomNumber[_user];
    }

    function getICA(address _contract) external view returns (address) {
        return
            IInterchainExecuteRouter(s_iexRouter).getRemoteInterchainAccount(
                s_destinationDomain,
                _contract
            );
    }

}

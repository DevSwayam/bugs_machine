// SPDX-License-Identifier: BSD-3-Clause-Clear

/* 
This contract is an example contract to demonstrate 
the cross-chain function call using ExecuteAPI 
on the inco chain.
*/

pragma solidity >=0.8.13 <0.9.0;

import "../lib/fhevm/abstracts/EIP712WithModifier.sol";
import "../lib/fhevm/lib/TFHE.sol";

interface IInterchainExecuteRouter {
    function getRemoteInterchainAccount(uint32 _destination, address _owner)
        external
        view
        returns (address);
}

interface IRandomNumberGenerator {
    function returnRandomNumber() external returns (uint16);
}

contract RandomNumberGenerator is EIP712WithModifier, IRandomNumberGenerator {
    
    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    // EOA address of owner for intialisation of contract
    address private immutable i_owner;

    uint32 private s_destinationDomain;
    // Interchain Exchange Router Contract Deployed on Red Stone
    address private s_iexRouter;

    // The Allowed caller Contract which can call callback functions
    address private s_caller_contract;

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event randomNumberGenerated(uint16 indexed number);

    /*//////////////////////////////////////////////////////////////
                                 Errors
    //////////////////////////////////////////////////////////////*/

    error RandomNumberGenerator__onlyOwmer();
    error RandomNumberGenerator__onlyCalllerContract();

    /*//////////////////////////////////////////////////////////////
                               MODIFIERS
    //////////////////////////////////////////////////////////////*/

    modifier _onlyOwner() {
        if (msg.sender != i_owner) {
            revert RandomNumberGenerator__onlyOwmer();
        }
        _;
    }

    modifier _onlyCallerContract() {
        if (msg.sender != s_caller_contract) {
            revert RandomNumberGenerator__onlyCalllerContract();
        }
        _;
    }

    /*//////////////////////////////////////////////////////////////
                                Constructor
    //////////////////////////////////////////////////////////////*/

    constructor() EIP712WithModifier("Authorization token", "1") {
        i_owner = msg.sender;
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

    function getCallerContractAddress() external view returns (address) {
        return s_caller_contract;
    }

    function getICA(address _contract) public view returns (address) {
        return
            IInterchainExecuteRouter(s_iexRouter).getRemoteInterchainAccount(
                s_destinationDomain,
                _contract
            );
    }

    /*//////////////////////////////////////////////////////////////
                                External Functions
    //////////////////////////////////////////////////////////////*/

    function initialize(
        uint32 _DestinationDomain,
        address _caller_contract,
        address _iexRouter
    ) external _onlyOwner {
        s_destinationDomain = _DestinationDomain;
        s_iexRouter = _iexRouter;
        s_caller_contract = _caller_contract;
    }

    function returnRandomNumber()
        external
        _onlyCallerContract
        returns (uint16)
    {
        uint16 _randomNumber = TFHE.decrypt(TFHE.randEuint16());
        emit randomNumberGenerated(_randomNumber);
        return _randomNumber;
    }
}

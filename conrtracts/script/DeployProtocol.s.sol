// SPDX-License-Identifier: MIT

import {Script} from "../lib/forge-std/src/Script.sol";
import {SlotMachine} from "../src/SlotMachine.sol";
import {RandomNumberGenerator} from "../src/RandomNumberGenerator.sol";

pragma solidity >=0.8.13 <0.9.0;

contract DeployProtocol is Script {
    // Contracts to Deploy
    SlotMachine slotMachine;
    RandomNumberGenerator randomNumberGenerator;

    // State Variables to initialise SlotMachine Contract Deployed on RedStone
    uint32 public constant _destinationDomainForInco = 9090;
    address public _iexRouterForRedStone =
        0xAa3a222f42D034BC45a732827888e2C152591592;
    address public _callerContractForRedStone =
        0xAa3a222f42D034BC45a732827888e2C152591592;

    // State Variables to initialise RandomNumberGenerator contract Deployed Inco
    uint32 public constant _destinationDomainForRedStone = 17001;
    address public _iexRouterForIncoNetwork =
        0x4Bc0b9BD1d285F10AE69cef5B8ACbeaf1d28D71B;

    function run() external returns (address, address) {
        uint256 deployerPrivateKeyForReadStone = vm.envUint(
            "REDSTONE_DEPLOYER_PRIVATE_KEY"
        );
        vm.createSelectFork("redstone_network");
        vm.startBroadcast(deployerPrivateKeyForReadStone);
        slotMachine = new SlotMachine();
        vm.stopBroadcast();

        uint256 deployerPrivateKeyForInco = vm.envUint(
            "INCO_DEPLOYER_PRIVATE_KEY"
        );
        vm.createSelectFork("inco_network");
        vm.startBroadcast(deployerPrivateKeyForInco);
        randomNumberGenerator = new RandomNumberGenerator();
        vm.stopBroadcast();

        return (address(slotMachine), address(randomNumberGenerator));
    }

    function initialiseSlotMachineContractDeployedOnRedStone(
        address _randomNumberGeneratorContractAddress
    ) public returns (address) {
        uint256 deployerPrivateKeyForReadStone = vm.envUint(
            "REDSTONE_DEPLOYER_PRIVATE_KEY"
        );
        vm.createSelectFork("redstone_network");
        vm.startBroadcast(deployerPrivateKeyForReadStone);
        slotMachine.initialize(
            _destinationDomainForInco,
            _randomNumberGeneratorContractAddress,
            _iexRouterForRedStone,
            _callerContractForRedStone
        );
        address _callerContractForInco = slotMachine.getICA(
            address(slotMachine)
        );
        vm.stopBroadcast();
        return (_callerContractForInco);
    }

    function initialiseRandomNumberGeneratorContractDeployedOnInco(
        address _callerContractAddress
    ) public {
        uint256 deployerPrivateKeyForInco = vm.envUint(
            "INCO_DEPLOYER_PRIVATE_KEY"
        );
        vm.createSelectFork("inco_network");
        vm.startBroadcast(deployerPrivateKeyForInco);
        randomNumberGenerator.initialize(
            _destinationDomainForRedStone,
            _callerContractAddress,
            _iexRouterForIncoNetwork
        );
        vm.stopBroadcast();
    }
}

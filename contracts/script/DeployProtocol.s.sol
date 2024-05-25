// SPDX-License-Identifier: MIT

import {Script} from "@forge-std/src/Script.sol";
import {SlotMachine} from "../src/inco_contracts/SlotMachine.sol";
import {BugsBridge} from "../src/red_stone_contracts/BugsBridge.sol";
import {console} from "@forge-std/src/Test.sol";

pragma solidity >=0.8.13 <0.9.0;

contract DeployProtocol is Script , console {

    // Contracts to Deploy
    SlotMachine slotMachine;
    BugsBridge bugsBridge;

    // State Variables to initialise SlotMachine Contract Deployed on RedStone
    uint32 public constant _destinationDomainForRedStone = 9090;
    address public _iexRouterForRedStone =
        0xAa3a222f42D034BC45a732827888e2C152591592;

    // State Variables to initialise RandomNumberGenerator contract Deployed Inco
    uint32 public constant _destinationDomainForInco = 17001;
    address public _iexRouterForIncoNetwork =
        0x4Bc0b9BD1d285F10AE69cef5B8ACbeaf1d28D71B;

    function run() external returns (address, address) {
        uint256 deployerPrivateKeyForReadStone = vm.envUint(
            "PRIVATE_KEY_BRIDGE_CONTRACT_DEPLOYMENT"
        );
        vm.createSelectFork("redstone_network");
        vm.startBroadcast(deployerPrivateKeyForReadStone);
        bugsBridge = new BugsBridge();
        vm.stopBroadcast();
        vm.setEnv("CONTRACT_ADDRESS_FOR_BRIDGE_CONTRACT",address(bugsBridge));

        uint256 deployerPrivateKeyForInco = vm.envUint(
            "INCO_DEPLOYER_PRIVATE_KEY"
        );

        vm.createSelectFork("inco_network");
        vm.startBroadcast(deployerPrivateKeyForInco);
        slotMachine = new SlotMachine();
        vm.stopBroadcast();

        console.log("Address of Slot Machine is : ",address(slotMachine));
        console.log("Address of Bridge is : ",address(bugsBridge));

        return (address(slotMachine), address(bugsBridge));
    }

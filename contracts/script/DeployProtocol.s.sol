// SPDX-License-Identifier: MIT

import {Script} from "@forge-std/src/Script.sol";
import {SlotMachine} from "../src/inco_contracts/SlotMachine.sol";
import {BugsBridge} from "../src/red_stone_contracts/BugsBridge.sol";
import {BUGS} from "../src/red_stone_contracts/Bugs.sol";
import "forge-std/console.sol";
pragma solidity >=0.8.13 <0.9.0;

contract DeployProtocol is Script  {

    BugsBridge bugsBridge;
    BUGS bugs;
    
    // The initial balance of the slot machine to be funded when the contract is deployed.
    uint256 private constant s_SlotMachineInititalBalance = 5000 * 10 ** 18;

    // State Variables to initialise SlotMachine Contract Deployed on RedStone
    uint32 public constant _destinationDomainForRedStone = 9090;
    address public _iexRouterForRedStone =
        0xAa3a222f42D034BC45a732827888e2C152591592;

    // State Variables to initialise RandomNumberGenerator contract Deployed Inco
    uint32 public constant _destinationDomainForInco = 17001;
    address public _iexRouterForIncoNetwork =
        0x4Bc0b9BD1d285F10AE69cef5B8ACbeaf1d28D71B;
    address public serverAddress = 0x1950498e95274Dc79Fbca238C2BE53684D69886F;


    function run() external returns (address, address) {

        // RedStone Part
        uint256 deployerPrivateKey = vm.envUint(
            "REDSTONE_PRIVATE_KEY_FOR_DEPLOYMENT"
        );
        vm.createSelectFork("redstone_network");
        vm.startBroadcast(deployerPrivateKey);
        bugsBridge = new BugsBridge();
        bugs = new BUGS();
        bugs.transfer(address(bugsBridge),s_SlotMachineInititalBalance);
        vm.stopBroadcast();
        address persistenBugsBridgeContractAddress = address(bugsBridge);
        vm.makePersistent(persistenBugsBridgeContractAddress);
        address persistentBugsAddress = address(bugs);
        vm.makePersistent(persistentBugsAddress);

        console.log("Bugs Contract Address is : ",address(bugs));
        console.log("Address of Bugs Bridge is : ",address(bugsBridge));


        vm.createSelectFork("inco_network");
        // Inco Part
        console.log("say hii");
        uint256 _deployerPrivateKey = vm.envUint(
            "REDSTONE_PRIVATE_KEY_FOR_DEPLOYMENT"
        );
        console.log("say hii");
        vm.startBroadcast(_deployerPrivateKey);
        SlotMachine slotMachine  = new SlotMachine();
        vm.stopBroadcast();
        console.log("Address of Slot Machine is : ",address(slotMachine));
        address persistenSlotMachineContractAdddress = address(slotMachine);
        vm.makePersistent(persistenSlotMachineContractAdddress);

        console.log("Address of Slot Machine is : ",address(slotMachine));
        console.log("Address of Bridge is : ",address(bugsBridge));


        // Red Stone Initialisation
        vm.createSelectFork("redstone_network");

        // Making the Transaction
        vm.startBroadcast(deployerPrivateKey);
        BugsBridge(persistenBugsBridgeContractAddress).initialize(_iexRouterForRedStone,_iexRouterForRedStone,persistenSlotMachineContractAdddress, persistentBugsAddress);
        vm.stopBroadcast();
        address persistent_ica_address = bugsBridge.getICA(persistenBugsBridgeContractAddress);
        vm.makePersistent(persistent_ica_address);


        // Inco Part
        vm.createSelectFork("inco_network");   

        vm.startBroadcast(deployerPrivateKey);
        SlotMachine(persistenSlotMachineContractAdddress).initialize(persistent_ica_address,_iexRouterForIncoNetwork,serverAddress);
        vm.stopBroadcast();
        
        return (address(slotMachine), address(bugsBridge));
    }
}
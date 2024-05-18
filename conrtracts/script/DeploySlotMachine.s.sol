// SPDX-License-Identifier: MIT

import {Script} from "../lib/forge-std/src/Script.sol";
import {SlotMachine} from "../src/SlotMachine.sol";

pragma solidity >=0.8.13 <0.9.0;

contract DeploySlotMachine is Script{
    SlotMachine slotMachine;

    function run() external returns(address){
        vm.startBroadcast();
        slotMachine = new SlotMachine();
        vm.stopBroadcast();
        return(address(slotMachine));
    }
}
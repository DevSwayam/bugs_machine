// SPDX-License-Identifier: MIT

import {Test} from "../lib/forge-std/src/Test.sol";
import {SlotMachine} from "../src/SlotMachine.sol";
import {BUGS} from "../src/BUGS.sol";

pragma solidity >=0.8.13 <0.9.0;

contract DeploySlotMachine is Test{

    SlotMachine _slotMachine; 
    BUGS _bugs; 
    uint256 public testPrivateKey;
    address public testPublicKey;

    function setUp() external {
        _slotMachine = SlotMachine(0x55df62A91801622B70026Aa8D0Ba3d1B8AaDEA7b);
        _bugs = BUGS(0x8ED8E66977541B6Ad412AA5CA7f21d21A7e565c1);
        testPrivateKey = vm.envUint(
            "PRIVATE_KEY"
        );
        testPublicKey = vm.addr(testPrivateKey);
    }

    function testSlotMachineSpinning() public {
        vm.createSelectFork("redstone_network");
        vm.startBroadcast(testPrivateKey);
        _slotMachine.spinSlotMachine();
        vm.stopBroadcast();
        bool isWaiting = _slotMachine.getUserAddressToIsWaiting(testPublicKey);
        assertEq(isWaiting,true);
    }

    function testSlotMachineRevertWhenTriedCallingMorethanOneTime() public{
        testSlotMachineSpinning();
        vm.startBroadcast(testPrivateKey);
        vm.expectRevert();
        _slotMachine.spinSlotMachine();
        vm.stopBroadcast();
    }
}
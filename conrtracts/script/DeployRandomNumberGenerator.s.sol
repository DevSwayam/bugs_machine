// SPDX-License-Identifier: MIT

import {Script} from "../lib/forge-std/src/Script.sol";
import {RandomNumberGenerator} from "../src/RandomNumberGenerator.sol";

pragma solidity >=0.8.13 <0.9.0;

contract DeployRandomNumberGenerator is Script{
    RandomNumberGenerator randomNumberGenerator;

    function run() external returns(address){
        vm.startBroadcast();
        randomNumberGenerator = new RandomNumberGenerator();
        vm.stopBroadcast();
        return(address(randomNumberGenerator));
    }
}
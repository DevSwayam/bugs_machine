import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Contract, ethers } from "ethers";
import { toast } from "sonner";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import {
  bugsABI,
  bugsContractAddress,
  slotMachineContractAddress,
} from "@/addresses";

const Withdraw = ({ withdrawAmmount, setWithdrawAmmount }) => {
  const { ready, user, login, logout, authenticated } = usePrivy();

  const [allowed, setAllowed] = useState("0");
  const { wallets } = useWallets();
  const w0 = wallets[0];

  const checkAllowance = async () => {
    const provider = await w0?.getEthersProvider();
    // const network = await provider.getNetwork();
    // if (network.chainId !== 17001) {
    //   addNetwork();
    // }

    const signer = await provider?.getSigner();

    const contractSM = new Contract(bugsContractAddress, bugsABI, signer);
    const address = w0.address;
    try {
      const totalAllowance = await contractSM.allowance(
        address,
        slotMachineContractAddress
        // price
      );

      const bigNumber = ethers.BigNumber.from(totalAllowance);
      const calculateAllowance = parseInt(bigNumber.toString());
      setAllowed(calculateAllowance.toString());
    } catch (error) {
      toast("Error Occured!");
      // setSpin(false);
    }
  };

  const decreaseAllowance = async () => {
    const provider = await w0?.getEthersProvider();
    // const network = await provider.getNetwork();
    // if (network.chainId !== 17001) {
    //   addNetwork();
    // }

    const signer = await provider?.getSigner();

    const contractSM = new Contract(bugsContractAddress, bugsABI, signer);

    const price = ethers.utils.parseUnits(withdrawAmmount, "ether");

    try {
      await contractSM.decreaseAllowance(slotMachineContractAddress, price);
    } catch (error) {
      toast("Error Occured!");
      // setSpin(false);
    }
  };
  useEffect(() => {
    if (ready && authenticated && w0?.address !== undefined) checkAllowance();
  }, [ready, authenticated]);
  return (
    <div className="w-full text-[#BCD0FC] grid gap-7">
      <p className="text-left text-xl">Amount</p>
      <div className="relative">
        <Input
          className="py-2 px-2 bg-transparent border-[#3673F5] text-[#3673F5] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          value={withdrawAmmount}
          onChange={(e) => setWithdrawAmmount(e.target.value)}
        />
        <p className="absolute top-2 right-4 text-[#3673F5]/60">$BUGS</p>
        {/* <p className="text-right text-sm mt-3">
          Available:{allowed === "0" ? "0" : allowed.slice(0, -18)}
        </p> */}
      </div>

      <Button
        className="bg-[#3673F5] hover:bg-[#3673F5]/60"
        onClick={decreaseAllowance}>
        Withdraw
      </Button>
    </div>
  );
};

export default Withdraw;

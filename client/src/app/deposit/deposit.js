import React, { useEffect, useState } from "react";
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

const Deposit = ({ depositAmmount, setDepositAmmount }) => {
  const { ready, user, login, logout, authenticated } = usePrivy();
  const [allowed, setAllowed] = useState("0");

  const { wallets } = useWallets();
  const w0 = wallets[0];
  async function addNetwork() {
    const provider = await w0?.getEthersProvider();
    //Request to add Inco chain
    await provider?.send("wallet_addEthereumChain", [
      {
        chainId: "0x4269",
        chainName: "Red Stone Network",
        nativeCurrency: {
          name: "RED",
          symbol: "ETH",
          decimals: 18,
        },
        rpcUrls: ["https://rpc.holesky.redstone.xyz/"],
        blockExplorerUrls: ["https://explorer.holesky.redstone.xyz/"],
      },
    ]);
  }
  const increaseAllowance = async () => {
    const provider = await w0?.getEthersProvider();
    const network = await provider.getNetwork();
    if (network.chainId !== 17001) {
      addNetwork();
    }

    const signer = await provider?.getSigner();

    const contractSM = new Contract(bugsContractAddress, bugsABI, signer);

    const price = ethers.utils.parseUnits(depositAmmount, "ether");

    try {
      await contractSM.increaseAllowance(slotMachineContractAddress, price);
    } catch (error) {
      toast("Error Occured!");
      // setSpin(false);
    }
  };

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

  useEffect(() => {
    if (ready && authenticated && w0?.address !== undefined) checkAllowance();
  }, [w0]);
  return (
    <div className="w-full text-[#BCD0FC] grid gap-7">
      <p className="text-left text-xl">Amount</p>
      <div className="relative">
        <Input
          className="py-2 px-2 bg-transparent border-[#3673F5] text-[#3673F5] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          value={depositAmmount}
          onChange={(e) => setDepositAmmount(e.target.value)}
        />
        <p className="absolute top-2 right-4 text-[#3673F5]/60">$BUGS</p>
        {/* <p className="text-right text-sm mt-3">
          Available:{allowed === "0" ? "0" : allowed.slice(0, -18)}
        </p> */}
      </div>

      <Button
        className="bg-[#3673F5] hover:bg-[#3673F5]/60"
        onClick={increaseAllowance}>
        Deposit
      </Button>
    </div>
  );
};

export default Deposit;

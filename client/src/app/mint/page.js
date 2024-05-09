"use client";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Contract, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import BugBalance from "./balance";
import { toast } from "sonner";
import { bugsABI, bugsContractAddress } from "@/addresses";

const Page = () => {
  const { ready, user, login, logout, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const [bugBalance, setBugBalance] = useState("0");
  const w0 = wallets[0];
  const [isMintBugDisable, setIsMintBugDisable] = useState(false);

  useEffect(() => {
    if (ready && authenticated && w0?.address !== undefined) getBugBalance();
  }, [w0]);

  const getBugBalance = async () => {
    const provider = await w0?.getEthersProvider();
    const signer = await provider?.getSigner();

    const contractSM = new Contract(
      bugsContractAddress,
      bugsABI,
      signer
    );
    const address = w0.address;
    try {
      const balance = await contractSM.balanceOf(address);

      const bigNumber = ethers.BigNumber.from(balance);
      setBugBalance(bigNumber.toString());
    } catch (error) {
      toast("Error Occured!");
      // setSpin(false);
    }
  };

  const mintBugs = async () => {
    setIsMintBugDisable(true);
    const provider = await w0?.getEthersProvider();
    // const network = await provider.getNetwork();
    // if (network.chainId !== 17001) {
    //   addNetwork();
    // }

    const signer = await provider?.getSigner();

    const contractSM = new Contract(
      bugsContractAddress,
      bugsABI,
      signer
    );

    try {
      const balance = await contractSM.transferFromOwner();
      contractSM.on("Transfer", (from, to, amount, event) => {
        getBugBalance();
        setIsMintBugDisable(false);
      });
    } catch (error) {
      toast("Error Occured!");
      // setSpin(false);
    }
  };
  return (
    <div className="w-screen flex items-center justify-center z-50">
      <div className="grid grid-cols-2 grid-rows-6 h-screen w-full md:max-w-[400px] px-4 md:px-0">
        <div className="col-span-2">
          <Navbar />
        </div>
        <div className="col-span-2">
          <BugBalance
            bugBalance={bugBalance}
            mintBugs={mintBugs}
            btnDisabled={isMintBugDisable}
          />
        </div>

        {/* <div className="col-span-2 row-span-4">
        {loading ? (
          <DepositLoading />
        ) : (
          <Deposit
            depositAmmount={depositAmmount}
            setDepositAmmount={setDepositAmmount}
          />
        )}
      </div> */}
      </div>
    </div>
  );
};

export default Page;

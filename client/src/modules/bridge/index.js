import LoadingAnimation from "@/assets/bloodDropLoading.json";
import { chainsName, switchToRedStoneNetwork } from "@/utils/chains";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SwitchNetwork } from "../game/switchNetwork";
import Navbar from "@/components/navbar";
import { BridgeAccordian } from "./accrodian";
import Lottie from "lottie-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Bridge = () => {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  const { wallets } = useWallets();
  const w0 = wallets[0];
  const [networkName, setNetworkName] = useState("");

  useEffect(() => {
    if (ready && authenticated && w0?.address !== undefined) {
      if (w0.chainId === "eip155:690" && ready) {
        setNetworkName(chainsName.redStone);
      }
    }
  }, [w0]);

  useEffect(() => {
    if (!authenticated && ready) router.push("/");
  }, [authenticated, ready]);

  if (!ready) return <Lottie animationData={LoadingAnimation} loop={true} />;

  if (networkName !== chainsName.redStone && authenticated)
    return (
      <SwitchNetwork
        isOpen={true}
        func={switchToRedStoneNetwork}
        w0={w0}
        setNetworkName={setNetworkName}
      />
    );

  if (networkName === chainsName.redStone && ready)
    return (
      <div className="w-screen flex items-center justify-center z-50">
        <div className="grid grid-cols-2 grid-rows-6 h-screen w-full md:max-w-[400px] px-4 md:px-0">
          <div className="col-span-2">
            <Navbar />
          </div>
          <div className="col-span-2 row-span-4">
           
            <BridgeAccordian w0={w0} />
            {/* {loading ? (
              <DepositLoading />
            ) : (
              <Deposit
                depositAmmount={depositAmmount}
                setDepositAmmount={setDepositAmmount}
              />
            )} */}
          </div>
        </div>
      </div>
    );
};

export default Bridge;

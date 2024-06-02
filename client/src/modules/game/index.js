import { chainsName, switchToIncoNetwork } from "@/utils/chains";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import SlotMachine from "./slotmachine";
import { play, stopSpining, win } from "@/utils/gameFunctions";
import { toast } from "sonner";
import LoadingAnimation from "@/assets/bloodDropLoading.json";
import Navbar from "@/components/navbar";
import { SwitchNetwork } from "./switchNetwork";
import { AlertDialogComp } from "../info/alert";
import Lottie from "lottie-react";
import {
  checkBettingAmmount,
  checkSlotMachineBalance,
  checkUserBalance,
  eventListener,
} from "@/utils/helper";
import AlertModal from "@/components/alert";
import { useBalance } from "wagmi";
import { AlertDialogComponent } from "./component/noBalancePopUp";

const Index = () => {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  const { wallets } = useWallets();
  const w0 = wallets[0];
  const [spin, setSpin] = useState(false);
  const [ring1, setRing1] = useState();
  const [ring2, setRing2] = useState();
  const [ring3, setRing3] = useState();
  const [start, setStart] = useState(false);
  const [value, setValue] = useState(-1);
  const [bettingAmount, setBettingAmount] = useState("0");
  const [price, setPrice] = useState();
  const [jackpot, setJackpot] = useState("0");
  const [userBalance, setUserBalance] = useState("0");
  const [popup, setPopup] = useState(false);
  const [isWinner, setisWinner] = useState(false);
  const [noBalancePopUp, setIsNoBalancePopUp] = useState(false);

  const handlePlay = () => {
    play(
      setStart,
      ring3,
      spin,
      setSpin,
      setRing1,
      setRing2,
      setRing3,
      setPrice,
      w0,
      setisWinner,
      setValue,
      setPopup
    );
  };

  useEffect(() => {
    if (start) {
      toast(
        "Bet can take some time to get result till then please wait paitently.."
      );
    }
  }, [start]);

  useEffect(() => {
    if (value !== -1) {
      stopSpining(setRing1, setRing2, setRing3);
      setStart(false);
      setValue(-1);
      checkUserBalance(w0, setUserBalance, setStart);
      checkSlotMachineBalance(w0, setJackpot, setStart);
      checkBettingAmmount(w0, setBettingAmount, setStart);
    }
  }, [value]);

  useEffect(() => {
    win(ring1, ring2, ring3, setPrice);
  }, [ring3]);

  useEffect(() => {
    if (ready && authenticated && w0?.address !== undefined) {
      if ( ready) {
        checkUserBalance(w0, setUserBalance, setStart,setIsNoBalancePopUp);
        checkSlotMachineBalance(w0, setJackpot, setStart);
        checkBettingAmmount(w0, setBettingAmount, setStart);
      }
    }
  }, [w0]);

  useEffect(() => {
    if (!authenticated && ready) router.push("/");
  }, [authenticated, ready]);

  // if(w0.chainId !== 'eip155:9090') return <></>

  if (!ready) return <Lottie animationData={LoadingAnimation} loop={true} />;

  if (ready && authenticated)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        
        <AlertModal
          isOpen={popup}
          setIsOpen={setPopup}
          isWinner={isWinner}
          jackpot={jackpot}
        />
        { noBalancePopUp && 
          <AlertDialogComponent 
          noPopUpBalance={noBalancePopUp}
        />
        }
        
        <div className="w-full">
          <Navbar />
        </div>

        <div className="grid grid-cols-2 grid-rows-9 h-screen w-full md:max-w-[400px] px-4 md:px-0 mt-16">
          <div className="col-span-2 row-span-1">
            <div className="w-full flex gap-2 flex-col justify-between items-center text-[#BCD0FC]">
              {
                jackpot !== "0" &&
                  <AlertDialogComp
                  bettingAmount={bettingAmount}
                  jackpot={jackpot}
                />
              }

              <div className="w-full flex">
                <div className="flex justify-between w-full">
                  <p className="text-left ">Jackpot: </p>
                  <p>{jackpot === "0" ? "0" : jackpot.slice(0, -18)} Bugs</p>
                </div>
              </div>
              <div className="w-full flex">
                <div className="flex justify-between w-full">
                  {/* <p className="text-sm mb-2">Balance:</p> */}
                  <p className="text-left ">Balance: </p>
                  <p>
                    {userBalance === "0" ? "0" : userBalance.slice(0, -18)} Bugs
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2 row-span-6">
            <SlotMachine
              bettingAmount={bettingAmount}
              // forceWithdrawal={forceWithdrawal}
              spin={spin}
              ring1={ring1}
              ring2={ring2}
              ring3={ring3}
              play={handlePlay}
              betSuccess={true}
              start={start}
              noBalancePopUp={noBalancePopUp}
            />
          </div>
        </div>
      </div>
    );
};

export default Index;

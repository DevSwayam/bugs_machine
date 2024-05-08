import Game from "@/components/game";
import Balance from "@/components/game/balance";
import Bet from "@/components/game/bet";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { win } from "@/utils/functions";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import React, { useEffect, useState } from "react";
import truncateEthAddress from "truncate-eth-address";
import { useAccount } from "wagmi";
import bugsABI from "@/assets/bugsAbi.json";
import { Contract, ethers } from "ethers";
import { toast } from "sonner";
import axios from "axios";
import SlotMachineABI from "@/assets/Slotmachine.json";
import AlertModal from "@/components/alert";
// import { bugsContract } from "@/contracts/bugs";

const App = () => {
  const { ready, user, login, logout, authenticated } = usePrivy();
  const [allowed, setAllowed] = useState("0");
  const { wallets } = useWallets();
  const w0 = wallets[0];
  const walletAddress = truncateEthAddress(user?.wallet?.address || "");
  const [wonPrize, setwonPrize] = useState(0);
  const [slotMachineContract, setSlotMachineContract] = useState();
  const [numberCall, setNumberCall] = useState(false);
  const [spin, setSpin] = useState(false);
  const [ring1, setRing1] = useState();
  const [ring2, setRing2] = useState();
  const [ring3, setRing3] = useState();
  const [price, setPrice] = useState();
  const [input, setInput] = useState(1);
  const [realBet, setRealBet] = useState();
  const [jackpot, setJackpot] = useState(0);
  const [balance, setBalance] = useState(100000);
  const [value, setValue] = useState(-1);
  const [betAmmount, setBetAmmount] = useState(0);
  const [betSuccess, setBetSuccess] = useState(false);
  const [address, setAddress] = useState("");
  const [popup, setPopup] = useState(false);
  const [bugBalance, setBugBalance] = useState("0");
  const [start,setStart] = useState(false);
  // useEffect(() => {
  //   bugsContract(w0, addNetwork, bugsABI);
  // }, []);

  async function addNetwork() {
    console.info("Adding network");
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

  useEffect(() => {
    if (value !== -1) {
      rand();
      setTimeout(() => {
        setPopup(true);
        checkAllowance()
        getBugBalance()
      }, 1000);
      setValue(-1);
      setStart(false)
    }
  
  }, [value]);

  useEffect(() => {
    win(ring1, ring2, ring3, setPrice);
  }, [ring3]);

  function rand() {
    setRing1(Math.floor(Math.random() * (100 - 1) + 1));
    setTimeout(function () {
      setRing2(Math.floor(Math.random() * (100 - 1) + 1));
    }, 1000);
    setTimeout(function () {
      setRing3(Math.floor(Math.random() * (100 - 1) + 1));
    }, 2000);
  }

  const getBugBalance = async () => {
    const provider = await w0?.getEthersProvider();
    // const network = await provider.getNetwork();
    // if (network.chainId !== 17001) {
    //   addNetwork();
    // }

    const signer = await provider?.getSigner();

    const contractSM = new Contract(
      "0x8ED8E66977541B6Ad412AA5CA7f21d21A7e565c1",
      bugsABI,
      signer
    );
    const address = w0.address;
    // console.log(address);
    setAddress(address);
    console.log(address);
    try {
      const balance = await contractSM.balanceOf(
        address
        // price
      );
      console.log(balance);

      const bigNumber = ethers.BigNumber.from(balance);
      const calculateAllowance = parseInt(bigNumber.toString());
      console.log(bigNumber.toString());
      // console.log(calculateAllowance.toString());
      setBugBalance(bigNumber.toString());
    } catch (error) {
      console.log(error);
      setStart(false)
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

    const contractSM = new Contract(
      "0x8ED8E66977541B6Ad412AA5CA7f21d21A7e565c1",
      bugsABI,
      signer
    );
    const address = w0.address;
    // console.log(address);
    setAddress(address);
    console.log(address);
    try {
      const totalAllowance = await contractSM.allowance(
        address,
        "0x55df62A91801622B70026Aa8D0Ba3d1B8AaDEA7b"
        // price
      );
      console.log(totalAllowance);

      const bigNumber = ethers.BigNumber.from(totalAllowance);
      // const calculateAllowance = parseInt(bigNumber.toString());
      console.log(bigNumber.toString());
      // console.log(calculateAllowance.toString());
      setAllowed(bigNumber.toString());
    } catch (error) {
      console.log(error);
      setStart(false)
      toast("Error Occured!");
      // setSpin(false);
    }
  };
  // console.log(balance)
  useEffect(() => {
    if (ready && authenticated && w0?.address !== undefined) {
      checkAllowance();
      getBugBalance();
    }
  }, [w0]);

  const getRandomNumber = async () => {
    if (address !== "") {
      const { data } = await axios.get(
        `https://bugs-machine-backend.vercel.app/api/getrandomnumber/${address}`
      );
      console.log({ data });
    } else console.log(address);
  };

  const spinSlotMachine = async () => {
    const provider = await w0?.getEthersProvider();
    const network = await provider.getNetwork();
    if (network.chainId !== 17001) {
      addNetwork();
    }

    const signer = await provider?.getSigner();
    setSpin(true);

    const contractSM = new Contract(
      "0x55df62A91801622B70026Aa8D0Ba3d1B8AaDEA7b",
      SlotMachineABI,
      signer
    );
    try {
      let count = 0;
      await contractSM.spinSlotMachine();
      contractSM.on(
        "betResolved",
        (userAddress, bettedBugsAmount, bugsAmountWonByUser, event) => {
          count++;
          console.log("Bet resolved event received:");
          console.log("User address:", userAddress);
          console.log("Betted bugs amount:", bettedBugsAmount.toString());
          console.log(
            "Bugs amount won by user:",
            bugsAmountWonByUser.toString()
          );
          if (count === 1) {
            setValue(bugsAmountWonByUser.toString());
            setStart(false)
            setwonPrize(bugsAmountWonByUser.toString());
          }
          console.log("Event:", event);
        }
      );
    } catch (error) {
      console.log(error);
      setStart(false);
      toast("Error Occured!");
      setSpin(false);
    }
  };

  // console.log(value);
  const play = async () => {
    setStart(true);
    console.log("playing");
    getRandomNumber();
    spinSlotMachine();
    if (ring3 > 1 || !spin) {
      if (input <= balance && input >= 1) {
        setRealBet(input);
        setSpin(true);
        setRing1();
        setRing2();
        setRing3();
        setBalance(balance - input);
        setJackpot(jackpot + input / 2);
      } else {
        setPrice(10);
      }
    }
  };
  return (
    <div className="w-screen flex items-center justify-center z-50">
      <AlertModal isOpen={popup} setIsOpen={setPopup} wonPrize={wonPrize} />
      {/* <button onClick={bugsContract}>sdcds</button> */}
      <div className="grid grid-cols-2 grid-rows-6 h-screen w-full md:max-w-[400px] px-4 md:px-0">
        <div className="col-span-2">{authenticated && <Navbar />}</div>
        {/* <div className="col-span-2">
          {authenticated && (
          <p>Allowance</p>
          )}
        </div> */}
        
        <div className="col-span-2">
          {authenticated && (
            <Balance
              allowed={allowed}
              setAllowed={setAllowed}
              bugBalance={bugBalance}
            />
          )}
        </div>
        <div className="col-span-2 row-span-6">
          {!authenticated && (
            <p className="mb-1 text-3xl text-center text-[#3673F5]">
              Bug Machine
            </p>
          )}
          <Game
            spin={spin}
            ring1={ring1}
            ring2={ring2}
            ring3={ring3}
            play={play}
            betSuccess={true}
            setBetSuccess={setBetSuccess}
            authenticated={authenticated}
            betAmmount={betAmmount}
            setBetAmmount={setBetAmmount}
            start={start}
          />
        </div>
      </div>
    </div>
  );
};

export default App;

import Game from "@/components/game";
import Balance from "@/components/game/balance";
import Navbar from "@/components/navbar";
import { win } from "@/utils/functions";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import React, { useEffect, useState } from "react";
import { Contract, ethers } from "ethers";
import { toast } from "sonner";
import axios from "axios";
import AlertModal from "@/components/alert";
import { SlotMachineABI, bugsABI, bugsContractAddress, slotMachineContractAddress } from "@/addresses";
// import { bugsContract } from "@/contracts/bugs";

const App = () => {
  const { ready, authenticated } = usePrivy();
  const [allowed, setAllowed] = useState("0");
  const { wallets } = useWallets();
  const w0 = wallets[0];
  const [wonPrize, setwonPrize] = useState(0);
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
  const [start, setStart] = useState(false);
  const backendAPI = process.env.backendAPI;

  useEffect(() => {
    if (start) {
      toast(
        "Bet can take some time to get reslut till then please wait paitently.."
      );
    }
  }, [start]);

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

  useEffect(() => {
    if (value !== -1) {
      rand();
      setTimeout(() => {
        setPopup(true);
        checkAllowance();
        getBugBalance();
      }, 1000);
      setValue(-1);
      setStart(false);
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

    const contractSM = new Contract(bugsContractAddress, bugsABI, signer);
    const address = w0.address;
    setAddress(address);
    try {
      const balance = await contractSM.balanceOf(
        address
        // price
      );

      const bigNumber = ethers.BigNumber.from(balance);
      setBugBalance(bigNumber.toString());
    } catch (error) {
      setStart(false);
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
    setAddress(address);
    try {
      const totalAllowance = await contractSM.allowance(
        address,
        slotMachineContractAddress
        
        // price
      );

      const bigNumber = ethers.BigNumber.from(totalAllowance);
      setAllowed(bigNumber.toString());
    } catch (error) {
      setStart(false);
      toast("Error Occured!");
      // setSpin(false);
    }
  };
  useEffect(() => {
    if (ready && authenticated && w0?.address !== undefined) {
      checkAllowance();
      getBugBalance();
    }
  }, [w0]);

  const getRandomNumber = async () => {
    if (address !== "") {
      try {
        const { data } = await axios.get(
          `${backendAPI}/getrandomnumber/${address}`
        );
      } catch (error) {}
    }
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
      slotMachineContractAddress,
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

          if (count === 1) {
            setValue(bugsAmountWonByUser.toString());
            setStart(false);
            setwonPrize(bugsAmountWonByUser.toString());
          }
        }
      );
    } catch (error) {
      setStart(false);
      toast("Error Occured!");
      setSpin(false);
    }
  };

  const forceWithdrawal = async () => {
    const provider = await w0?.getEthersProvider();
    const signer = await provider?.getSigner();

    const contractSM = new Contract(
      slotMachineContractAddress,
      SlotMachineABI,
      signer
    );
    try {
      await contractSM.forceWithdrawlIfBridgeTransactionFails();
    } catch (error) {
      toast("Error Occured!");
    }
  };

  const play = async () => {
    setStart(true);
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
      {authenticated ? (
        <div className="grid grid-cols-2 grid-rows-6 h-screen w-full md:max-w-[400px] px-4 md:px-0">
          <div className="col-span-2">{authenticated && <Navbar />}</div>

          <div className="col-span-2">
            <Balance
              allowed={allowed}
              setAllowed={setAllowed}
              bugBalance={bugBalance}
            />
          </div>

          <div className="col-span-2 row-span-6">
            <Game
              forceWithdrawal={forceWithdrawal}
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
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 h-screen w-full md:max-w-[400px] px-4 md:px-0">
          <p className="mb-1 text-3xl text-center text-[#3673F5] col-span-2">
            Bug Machine
          </p>
          <div className="col-span-2 row-span-1">
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
      )}
    </div>
  );
};

export default App;

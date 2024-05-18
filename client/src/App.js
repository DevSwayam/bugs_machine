/* eslint-disable no-undef */
import { useRef, useLayoutEffect, useState, useEffect } from 'react'
import abi from './assets/abi.json'
import './App.css';
import { Contract } from "ethers";
import { Web3Provider } from '@ethersproject/providers';
import truncateEthAddress from 'truncate-eth-address';
import Row1 from './components/row1';
import Row2 from './components/row2';
import Row3 from './components/row3';
import Result from './components/result';
import { numChecker, win } from './utils/functions';
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { toast } from 'sonner';
import { FaGripLinesVertical } from "react-icons/fa";


const App = () => {
  const { ready, user, login, logout, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const w0 = wallets[0];
  const walletAddress = truncateEthAddress(user?.wallet?.address || "");
  const [randomNumber, setRandomNumber] = useState(-1)
  const [slotMachineContract, setSlotMachineContract] = useState();
  const [numberCall, setNumberCall] = useState(false)
  const [spin, setSpin] = useState(false)
  const [ring1, setRing1] = useState()
  const [ring2, setRing2] = useState()
  const [ring3, setRing3] = useState()
  const [price, setPrice] = useState()
  const [input, setInput] = useState(50)
  const [realBet, setRealBet] = useState()
  const [jackpot, setJackpot] = useState(0)
  const [balance, setBalance] = useState(100000)
  const [value, setValue] = useState(-1);
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => {
    setIsHovered(!isHovered);
  };

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
      setIsHovered(false)
      rand();
      setValue(-1)
    }
  }, [value]);


  useEffect(() => {
    win(ring1, ring2, ring3, balance, setBalance, jackpot, setJackpot, setPrice)
  }, [ring3])

  function rand() {
    setRing1(Math.floor(Math.random() * (100 - 1) + 1))
    setTimeout(function () { setRing2(Math.floor(Math.random() * (100 - 1) + 1)) }, 1000)
    setTimeout(function () { setRing3(Math.floor(Math.random() * (100 - 1) + 1)) }, 2000)
  }

  // eslint-disable-next-line
  const getRandomNumber = async () => {
    const provider = await w0?.getEthersProvider();
    const network = await provider.getNetwork();
    if (network.chainId !== 17001) {
      addNetwork();
    }

    const signer = await provider?.getSigner();
    setSpin(true)

    const contractSM = new Contract('0x275C42c018E70f993734F1D200f474A97Af9Ff8E', abi, signer);
    setSlotMachineContract(contractSM);
    try {
      await contractSM.GetNumber();
      contractSM.on("randomNumberGenerated", (number, uniqueId, user) => {
        let randomNumberEvent = {
          rndNumber: number,
          uniqueId: uniqueId,
          value: value,
          user: user,
        }
        const rndNumber = parseInt(randomNumberEvent.rndNumber, 16);
        setRandomNumber(rndNumber)
        setValue(rndNumber)
      })
    } catch (error) {
      console.log(error)
      toast('Error Occured!')
      setIsHovered(false)
      setSpin(false)
    }

  }

  async function play() {
    setIsHovered(true)
    getRandomNumber();
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
  }

  return (
    <div className="min-h-[100vh] justify-center flex gap-4 w-full flex-col max-w-[500px] m-auto items-center">
      <div className='flex flex-col items-center justify-center text-yellow-500'>
        {
          authenticated ?
            <div className="w-full">
              <p className='w-full text-white'>{walletAddress}</p>
              <button className="w-full text-center text-blue-400" onClick={logout}>
                Logout
              </button>
            </div>
            :
            <div className="Wallet">
              <p>No wallet connected</p>
            </div>
        }
        {/* <h1 className="text-center">{"Available cash: " + Math.round((balance * 100)) / 100 + "€"}</h1> */}
        {/* <button onClick={() => setBalance(balance + 1000)} className="buyMoreButton">Add 1000 €</button> */}
      </div>

      <div className='border-2 border-blue-400 w-full flex flex-col justify-center items-center py-6 rounded-xl '>
        <h1 className="text-2xl text-blue-400">Slot Machine</h1>
      </div>


      <div className="flex h-[350px] overflow-hidden border-2 border-blue-400 rounded-lg">
        <div className='mx-5'>
          {<Row1 spin={spin} ring1={ring1} />}
        </div>
        <div className='mx-5'>
          {<Row2 spin={spin} ring2={ring2} />}
        </div>
        <div className='mx-5'>
          {<Row3 spin={spin} ring3={ring3} />}
        </div>
      </div>

      <h1 className='text-white'>
        {<Result price={price} ring3={ring3} />}
      </h1>
      <div className="w-full">

        {
          ready ?
            !authenticated ?
              <button className="w-full mt-2 bg-blue-400 py-3 text-xl px-5 rounded-lg flex items-center justify-center"
                onMouseEnter={handleHover}
                onMouseLeave={handleHover}
                onClick={login}>
                {isHovered && <FaGripLinesVertical className='rotate-12 mx-5' />}  Login to Play {isHovered && <FaGripLinesVertical className='rotate-12 mx-5' />}
              </button>
              :
              <button
                className="w-full mt-2 bg-blue-400 py-3 text-xl px-5 rounded-lg flex items-center justify-center"
                onMouseEnter={handleHover}
                onMouseLeave={handleHover}
                onClick={play}
              >
                {isHovered && <FaGripLinesVertical className='rotate-12 mx-5' />}
                PLAY
                {isHovered && <FaGripLinesVertical className='rotate-12 mx-5' />}
              </button>
            :
            undefined
        }
      </div>

    </div>

  )
}

export default App;

/* eslint-enable no-undef */

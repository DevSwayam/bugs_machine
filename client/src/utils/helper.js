import { Contract, ethers } from "ethers";
import { toast } from "sonner";
import { SlotMachineABI, slotMachineContractAddress } from "./contract";
import axios from "axios";
const backendAPI = process.env.backendAPI;

export const checkUserBalance = async (w0, setUserBalance, setStart) => {
  const provider = await w0?.getEthersProvider();
  const signer = await provider?.getSigner();
  const contractSM = new Contract(
    slotMachineContractAddress,
    SlotMachineABI,
    signer
  );
  const address = w0.address;
  try {
    const ptsBalance = await contractSM.s_UserAddressToPoints(address);

    const bigNumber = ethers.BigNumber.from(ptsBalance);
    setUserBalance(bigNumber.toString());
  } catch (error) {
    setStart(false);
    console.log(error);
    toast(error?.message);
    // setSpin(false);
  }
};

export const checkSlotMachineBalance = async (w0, setJackpot, setStart) => {
  const provider = await w0?.getEthersProvider();
  const signer = await provider?.getSigner();
  const contractSM = new Contract(
    slotMachineContractAddress,
    SlotMachineABI,
    signer
  );
  try {
    const jackpotPts = await contractSM.s_SlotMachineBalance();

    const bigNumber = ethers.BigNumber.from(jackpotPts);
    setJackpot(bigNumber.toString());
  } catch (error) {
    setStart(false);
    console.log(error);
    toast(error?.message);
    // setSpin(false);
  }
};

export const checkBettingAmmount = async (w0, setBettingAmount, setStart) => {
  const provider = await w0?.getEthersProvider();
  const signer = await provider?.getSigner();
  const contractSM = new Contract(
    slotMachineContractAddress,
    SlotMachineABI,
    signer
  );
  try {
    const btngAmount = await contractSM.s_SpinCharge();

    const bigNumber = ethers.BigNumber.from(btngAmount);
    setBettingAmount(bigNumber.toString());
  } catch (error) {
    setStart(false);
    console.log(error);
    toast(error?.message);
    // setSpin(false);
  }
};

const EIP712ServerCall = async (
  expiryTime,
  signature,
  setStart,
  setSpin,
  address
) => {
  try {
    const receipt = await axios.post(`https://bugs-machine-backend.vercel.app/api/eip712call/${address}`, {
      expiryTime: expiryTime,
      bytesSignature: signature,
    });
  } catch (error) {
    console.log(error);
    setStart(false);
    toast("Error Occured!");
    setSpin(false);
  }
};

export const signMessage = async (
  w0,
  setStart,
  setSpin,
  setisWinner,
  setValue,
  setPopup
) => {
  const address = w0.address;
  const provider = await w0?.getEthersProvider();
  const signer = await provider?.getSigner();
  const currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = currentTime + 120;

  const domain = {
    name: "SlotMachine",
    version: "1",
    chainId: await signer.getChainId(),
    verifyingContract: slotMachineContractAddress,
  };

  const types = {
    Spin: [
      { name: "user", type: "address" },
      { name: "expiration", type: "uint256" },
    ],
  };

  const value = {
    user: address,
    expiration: expirationTime,
  };

  try {
    const signature = await signer._signTypedData(domain, types, value);
    console.log(signature);
    await EIP712ServerCall(
      expirationTime,
      signature,
      setStart,
      setSpin,
      address
    );
    eventListener(w0, setisWinner, setStart, setValue, setPopup);
    // Send signature to server for further processing
    // console.log(signature);
  } catch (error) {
    console.error("Error signing message:", error.message);
  }
};
const eventListener = async (w0, setisWinner, setStart, setValue, setPopup) => {
  const provider = await w0?.getEthersProvider();
  const signer = await provider?.getSigner();
  const contractSM = new Contract(
    slotMachineContractAddress,
    SlotMachineABI,
    signer
  );
  try {
    let count = 0;
    contractSM.on("BetPlaced", (userAddress, isWinner) => {
      if (userAddress === w0.address) {
        count++;
        if (count === 1) {
          setisWinner(isWinner);
          setPopup(true);
          setValue(40);
        }
      }
    });
  } catch (error) {
    setStart(false);
    console.log(error);
    toast(error?.message);
    // setSpin(false);
  }
};

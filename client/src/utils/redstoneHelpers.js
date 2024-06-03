import { Contract, ethers } from "ethers";
import {
  SlotMachineABI,
  bugsABI,
  bugsBridgeABI,
  bugsBridgeContractAddress,
  bugsContractAddress,
  incoMailboxAddress,
  mailBoxABI,
  redStoneMailboxAddress,
  slotMachineContractAddress,
} from "./contract";
import { toast } from "sonner";

export const approveBugs = async (
  w0,
  depositAmmount,
  setIsApprove,
  setWaitingForApproval,
  setReloadPage,
  setBugsApprovalAmount
) => {
  setWaitingForApproval(true);
  const provider = await w0?.getEthersProvider();
  const signer = await provider?.getSigner();

  const bugsContract = new Contract(bugsContractAddress, bugsABI, signer);

  const price = ethers.utils.parseUnits(depositAmmount, "ether");

  try {
    const receipt = await bugsContract.approve(
      bugsBridgeContractAddress,
      price
    );
    if (receipt?.from === w0.address) {
      toast.success("Token Approved successfully!");
    }
    let count = 0;
    bugsContract.on("Approval", (owner, spender, value) => {
      count++;
      if (count === 1) {
        setIsApprove(true);
        setWaitingForApproval(false);
        const randomNumber = Math.floor(Math.random * 10000);
        setReloadPage(randomNumber);
      }
      console.log("Approval event detected:");
      console.log(`Owner: ${owner}`);
      console.log(`Spender: ${spender}`);
      console.log(`Value: ${ethers.utils.formatUnits(value, 18)} tokens`);
      setBugsApprovalAmount(ethers.utils.formatUnits(value, 18))
    });

    console.log("Event listener set up and running...");
  } catch (error) {
    toast("Error Occured!");
    setWaitingForApproval(false);
    // setSpin(false);
  }
};

export const depositBugsCall = async (
  w0,
  depositAmmount,
  setIsBugsLocked,
  loading,
  setLoading,
  currentState,
  setCurrentState,
  setReloadPage
) => {
  const provider = await w0?.getEthersProvider();
  const signer = await provider?.getSigner();

  const bugsBridgeContract = new Contract(
    bugsBridgeContractAddress,
    bugsBridgeABI,
    signer
  );

  const price = ethers.utils.parseUnits(depositAmmount, "ether");

  try {
    const receipt = await bugsBridgeContract.depositBugs(price);
    if (receipt?.from === w0.address) {
      setCurrentState((prev) => 0); //for loading
      setLoading(true);
      toast.success("Transaction Initiated...");
    }

    let count = 0;
    bugsBridgeContract.on("BugsDeposited", (userAddress, bugsAmount) => {
      console.log("bugsDeposited event detected:");
      console.log(`User Address: ${userAddress}`);
      console.log(`Bugs Amount: ${bugsAmount}`);
      if (userAddress === w0.address) {
        count++;
        if (count === 1) {
          setCurrentState(1);
          setTimeout(() => {
            setCurrentState(2);
          }, 3500);
          // setIsBugsLocked(true); //popup
        }
      }
    });
    const rpcUrl = "https://testnet.inco.org";
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const incoMailBox = new Contract(incoMailboxAddress, mailBoxABI, provider);

    let incoMailCountTracker = 0;
    incoMailBox.on("Dispatch", (sender, destination, recipient, message) => {
      // if (sender === '0x000000000000000000000000e15149324a5334671ba0213ba98895bd95d3bdb2') {
      incoMailCountTracker++;
      if (incoMailCountTracker === 1) {
        setCurrentState(3);
        setTimeout(() => {
          setIsBugsLocked(true); //popup
        }, 1000);
        const randomNumber = Math.floor(Math.random * 10000);
        setReloadPage(randomNumber);
      }
      // }
    });
  } catch (error) {
    console.log(error);
    setLoading(false);
    setCurrentState(0);
    toast("Error Occured!");
    // setSpin(false);
  }
};

export const withdrawBugs = async (
  w0,
  loading,
  setLoading,
  currentState,
  setCurrentState,
  setReloadPage
) => {
  const provider = await w0?.getEthersProvider();
  const signer = await provider?.getSigner();

  const bugsBridgeContract = new Contract(
    bugsBridgeContractAddress,
    bugsBridgeABI,
    signer
  );

  try {
    const receipt = await bugsBridgeContract.withdrawBugs();
    if (receipt?.from === w0.address) {
      setCurrentState((prev) => 0);
      setLoading(true);
      toast.success("Transaction Initiated...");
    }

    const redStoneMailBoxContract = new Contract(
      redStoneMailboxAddress,
      mailBoxABI,
      signer
    );

    let redStoneMailBoxTracker = 0;
    redStoneMailBoxContract.on(
      "Dispatch",
      (sender, destination, recipient, message) => {
        // if (sender === '0x000000000000000000000000e15149324a5334671ba0213ba98895bd95d3bdb2') {
        redStoneMailBoxTracker++;
        if (redStoneMailBoxTracker === 1) {
          setCurrentState(1);
        }
        // }
      }
    );

    const rpcUrl = "https://testnet.inco.org";
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const incoMailBox = new Contract(incoMailboxAddress, mailBoxABI, provider);

    let incoMailCountTracker = 0;
    incoMailBox.on("Dispatch", (sender, destination, recipient, message) => {
      // if (sender === '0x000000000000000000000000e15149324a5334671ba0213ba98895bd95d3bdb2') {
      incoMailCountTracker++;
      if (incoMailCountTracker === 1) {
        setCurrentState(2);
      }
      // }
    });

    const bugsContract = new Contract(bugsContractAddress, bugsABI, signer);
    let count = 0;
    bugsContract.on("Transfer", (from, to, value) => {
      if (to === w0.address) {
        count++;
        if (count === 1) {
          setCurrentState(3);
          toast.success("You received tokens, you can close this window.");
          const randomNumber = Math.floor(Math.random * 10000);
          setReloadPage(randomNumber);
        }
      }
    });
  } catch (error) {
    toast("Error Occured!");
    // setSpin(false);
  }
};

export const checkActualUserBugBalance = async (w0, setActualBugBalance) => {
  const rpcUrl = "https://testnet.inco.org";
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const contractSM = new Contract(
    slotMachineContractAddress,
    SlotMachineABI,
    provider
  );
  const address = w0.address;
  try {
    const ptsBalance = await contractSM.getUserPoints(address);

    const bigNumber = ethers.BigNumber.from(ptsBalance);
    setActualBugBalance(bigNumber.toString());
  } catch (error) {
    console.log(error);
    toast(error?.message);
    // setSpin(false);
  }
};

export const forceWithdrawBugs = async (w0) => {
  const provider = await w0?.getEthersProvider();
  const signer = await provider?.getSigner();

  const bugsBridgeContract = new Contract(
    bugsBridgeContractAddress,
    bugsBridgeABI,
    signer
  );

  try {
    const receipt = await bugsBridgeContract.forceWithDrawl();
    if (receipt?.from === w0.address)
      toast.success("Token withdrawn successfully!");
  } catch (error) {
    toast("5 minutes has not passed ");
    // setSpin(false);
  }
};

export const mintBugs = async (w0, setReloadPage) => {
  const provider = await w0?.getEthersProvider();
  const signer = await provider?.getSigner();

  const bugsBridgeContract = new Contract(bugsContractAddress, bugsABI, signer);

  try {
    await bugsBridgeContract.transferFromOwner();
    let count = 0;
    bugsBridgeContract.on("Transfer", (from, to, amount) => {
      console.log("Transfer event detected:");
      console.log(`From: ${from}`);
      console.log(`To: ${to}`);
      console.log(`Amount: ${amount}`);
      if (to === w0.address) {
        count++;
        if (count == 1) {
          toast("Test bugs minted successfully!");
          const randomNumber = Math.floor(Math.random * 10000);
          setReloadPage(randomNumber);
        }
      }
    });
  } catch (error) {
    toast("Error Occured!");
    // setSpin(false);
  }
};

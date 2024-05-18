import { Contract, ethers } from "ethers";
import {
  bugsABI,
  bugsBridgeABI,
  bugsBridgeContractAddress,
  bugsContractAddress,
  slotMachineContractAddress,
} from "./contract";
import { toast } from "sonner";

export const approveBugs = async (w0, depositAmmount, setIsApprove) => {
  const provider = await w0?.getEthersProvider();
  const signer = await provider?.getSigner();

  const bugsContract = new Contract(bugsContractAddress, bugsABI, signer);

  const price = ethers.utils.parseUnits(depositAmmount, "ether");

  try {
    await bugsContract.increaseAllowance(bugsBridgeContractAddress, price);
    let count = 0;
    bugsContract.on("Approval", (owner, spender, value) => {
      count++;
      if (count === 1) {
        setIsApprove(true);
      }
      console.log("Approval event detected:");
      console.log(`Owner: ${owner}`);
      console.log(`Spender: ${spender}`);
      console.log(`Value: ${ethers.utils.formatUnits(value, 18)} tokens`);
    });

    console.log("Event listener set up and running...");
  } catch (error) {
    toast("Error Occured!");
    // setSpin(false);
  }
};

export const depositBugsCall = async (w0, depositAmmount, setIsBugsLocked) => {
  const provider = await w0?.getEthersProvider();
  const signer = await provider?.getSigner();

  const bugsBridgeContract = new Contract(
    bugsBridgeContractAddress,
    bugsBridgeABI,
    signer
  );

  const price = ethers.utils.parseUnits(depositAmmount, "ether");

  try {
    await bugsBridgeContract.depositBugs(price);
    let count = 0;
    bugsBridgeContract.on("bugsDeposited", (userAddress, bugsAmount) => {
      console.log("bugsDeposited event detected:");
      console.log(`User Address: ${userAddress}`);
      console.log(`Bugs Amount: ${bugsAmount}`);
      if (userAddress === w0.address) {
        count++;
        if (count === 1) {
          setIsBugsLocked(true);
        }
      }
    });

    console.log("Event listener set up and running...");
  } catch (error) {
    toast("Error Occured!");
    // setSpin(false);
  }
};

export const withdrawBugs = async (w0) => {
  const provider = await w0?.getEthersProvider();
  const signer = await provider?.getSigner();

  const bugsBridgeContract = new Contract(
    bugsBridgeContractAddress,
    bugsBridgeABI,
    signer
  );

  try {
    const receipt = await bugsBridgeContract.withDrawAllRemainingBugs();
    if (receipt?.from === w0.address)
      toast.success("Token withdrawn successfully!");
  } catch (error) {
    toast("Error Occured!");
    // setSpin(false);
  }
};

export const mintBugs = async (w0) => {
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
        if (count == 1) toast("Test bugs minted successfully!");
      }
    });
  } catch (error) {
    toast("Error Occured!");
    // setSpin(false);
  }
};

import {
  bugsABI,
  bugsBridgeContractAddress,
  bugsContractAddress,
} from "./contract";
import { Contract, ethers } from "ethers";
import { toast } from "sonner";

export const checkBugsBalanceForUser = async (w0, setBugsBalance) => {
  const provider = await w0?.getEthersProvider();
  const signer = await provider?.getSigner();
  const address = w0.address;
  const bugsContract = new Contract(bugsContractAddress, bugsABI, signer);

  try {
    const balance = await bugsContract.balanceOf(address);
    const bigNumber = ethers.BigNumber.from(balance);
    // console.log(bigNumber.toString());

    setBugsBalance(bigNumber.toString());
  } catch (error) {
    console.log(error);
    toast("Error Occured!");
    // setSpin(false);
  }
};

export const checkAllowanceOfUser = async (w0, setBugsApprovalAmount) => {
  const provider = await w0?.getEthersProvider();
  const signer = await provider?.getSigner();
  const address = w0.address;
  const bugsContract = new Contract(bugsContractAddress, bugsABI, signer);

  try {
    const balance = await bugsContract.allowance(
      address,
      bugsBridgeContractAddress
    );
    const bigNumber = ethers.BigNumber.from(balance);
    setBugsApprovalAmount(bigNumber.toString());
  } catch (error) {
    toast("Error Occured!");
    // setSpin(false);
  }
};

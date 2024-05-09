import { bugsContractAddress, slotMachineContractAddress } from "@/addresses";
import { Contract, ethers } from "ethers";

export const bugsContract = async (w0, addNetwork, abi) => {
  const provider = await w0?.getEthersProvider();
  const network = await provider.getNetwork();
  if (network.chainId !== 17001) {
    addNetwork();
  }

  const signer = await provider?.getSigner();

  const contractSM = new Contract(
    bugsContractAddress,
    abi,
    signer
  );

  const price = ethers.utils.parseUnits("100", "ether");

  try {
    await contractSM.increaseAllowance(
      slotMachineContractAddress,
      price
    );
  } catch (error) {
    toast("Error Occured!");
    // setSpin(false);
  }
};

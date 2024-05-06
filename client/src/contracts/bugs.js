import { Contract, ethers } from "ethers";

export const bugsContract = async (w0, addNetwork, abi) => {
  const provider = await w0?.getEthersProvider();
  const network = await provider.getNetwork();
  if (network.chainId !== 17001) {
    addNetwork();
  }

  const signer = await provider?.getSigner();

  const contractSM = new Contract(
    "0x8ED8E66977541B6Ad412AA5CA7f21d21A7e565c1",
    abi,
    signer
  );

  const price = ethers.utils.parseUnits("100", "ether");

  try {
    await contractSM.increaseAllowance(
      "0x55df62A91801622B70026Aa8D0Ba3d1B8AaDEA7b",
      price
    );
  } catch (error) {
    console.log(error);
    toast("Error Occured!");
    // setSpin(false);
  }
};

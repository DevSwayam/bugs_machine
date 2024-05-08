import { Contract } from "ethers";

export const contractInteractionOne = async (w0, addNetwork, abi) => {
  const provider = await w0?.getEthersProvider();
  const network = await provider.getNetwork();
  if (network.chainId !== 17001) {
    addNetwork();
  }

  const signer = await provider?.getSigner();
  setSpin(true);

  const contractSM = new Contract(
    "0x275C42c018E70f993734F1D200f474A97Af9Ff8E",
    abi,
    signer
  );
  try {
    let count = 0;
    await contractSM.GetNumber();
    contractSM.on("randomNumberGenerated", (number, uniqueId, user) => {
      let randomNumberEvent = {
        rndNumber: number,
        uniqueId: uniqueId,
        value: value,
        user: user,
      };
      count++;
      const rndNumber = parseInt(randomNumberEvent.rndNumber, 16);
      if (count === 1) {
        setValue(rndNumber);
      }
    });
  } catch (error) {
    toast("Error Occured!");
    setSpin(false);
  }
};

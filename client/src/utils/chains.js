import { toast } from "sonner";

export const chainsName = { redStone: "RedStone", inco: "Inco" };

export const redStone = {
  id: 17069,
  network: "Red Stone Network",
  name: "ETH",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.garnetchain.com/"],
    },
    public: {
      http: ["https://rpc.garnetchain.com/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://explorer.holesky.redstone.xyz/",
    },
  },
};

export const incoNetwork = {
  id: 9090,
  network: "Inco Gentry Testnet",
  name: "INCO",
  nativeCurrency: {
    name: "INCO",
    symbol: "INCO",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://testnet.inco.org/"],
    },
    public: {
      http: ["https://testnet.inco.org/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://explorer.testnet.inco.org",
    },
  },
};

export async function switchToIncoNetwork(w0, setter) {
  try {
    const provider = await w0?.getEthersProvider();
    const res = await provider?.send("wallet_addEthereumChain", [
      {
        chainId: "0x2382",
        chainName: "Inco Gentry Testnet",
        nativeCurrency: {
          name: "INCO",
          symbol: "INCO",
          decimals: 18,
        },
        rpcUrls: ["https://testnet.inco.org/"],
        blockExplorerUrls: ["https://explorer.testnet.inco.org"],
      },
    ]);

    const network = await provider.detectNetwork();
    if (network.chainId === 9090) {
      setter(chainsName.inco);
    }
  } catch (error) {
    console.log(error?.message);
    toast(error?.message);
  }
}

export async function switchToRedStoneNetwork(w0, setter) {
  try {
    const provider = await w0?.getEthersProvider();
    const res = await provider?.send("wallet_addEthereumChain", [
      {
        chainId: "0x42AD",
        chainName: "Red Stone Network",
        nativeCurrency: {
          name: "RED",
          symbol: "ETH",
          decimals: 18,
        },
        rpcUrls: ["https://rpc.garnetchain.com/"],
        blockExplorerUrls: ["https://explorer.garnetchain.com/"],
      },
    ]);

    const network = await provider.detectNetwork();
    if (network.chainId === 17069) {
      setter(chainsName.redStone);
    }
  } catch (error) {
    console.log(error?.message);
    toast(error?.message);
  }
}

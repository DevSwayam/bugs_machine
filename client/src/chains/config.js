import { publicProvider } from "wagmi/providers/public";
import { redStone } from ".";
import { WagmiConfig, createClient, configureChains, chain } from "wagmi";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";

export const { chains, provider } = configureChains(
  [redStone],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Test web3 app",
  chains,
});

export const wagmiClient = createClient({
  autoConnect: true,
  provider,
  connectors,
});

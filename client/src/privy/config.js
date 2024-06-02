import { incoNetwork, redStone } from "@/utils/chains";

export const privyConfig = {
  appId: "cltn4pfm807ld12sf83bqr3iy",
  config: {
    logo: "https://your.logo.url",
    appearance: { theme: "dark" },
    loginMethods: ["wallet"],
    appearance: {
      walletList: ["metamask", "detected_wallets", "rainbow"],
      theme: "dark",
    },
    defaultChain: redStone,
    supportedChains: [redStone, incoNetwork],
    embeddedWallets: {
      createOnLogin: "users-without-wallets",
    },
  },
};

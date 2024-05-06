"use client";
import { redStone } from "@/chains";
import { PrivyProvider } from "@privy-io/react-auth";

const CustomPrivyProvider = ({ children }) => {
  return (
    <PrivyProvider
      appId="cltn4pfm807ld12sf83bqr3iy"
      config={{
        logo: "https://your.logo.url",
        appearance: { theme: "dark" },
        // Display email and wallet as login methods
        loginMethods: ["wallet"],
        // Customize Privy's appearance in your app
        appearance: {
          walletList: [
            "metamask",
            "detected_wallets",
            "wallet_connect",
            "rainbow",
          ],
          // Defaults to 'light'
          theme: "dark",
        },
        supportedChains: [redStone],

        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}>
      {children}
    </PrivyProvider>
  );
};

export default CustomPrivyProvider;

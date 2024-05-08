import { ConnectButton } from "@rainbow-me/rainbowkit";
import LogoutIcon from "@/assets/log-out.svg";
import Image from "next/image";
export const WalletInfo = ({ accountAddress }) => {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, mounted }) => {
        const ready = mounted;
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
            })}>
            {(() => {
              return (
                <div className="w-full flex justify-between">
                  <button type="button" className="bg-[#BCD0FC]">
                    {accountAddress+'...'}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </button>
                  <Image
                    src={LogoutIcon}
                    onClick={openAccountModal}
                    alt="logout"
                  />
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

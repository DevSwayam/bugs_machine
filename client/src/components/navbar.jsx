"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import BackImg from "@/assets/backarraow.svg";
import { WalletInfo } from "./walletInfo";
import { usePathname, useRouter } from "next/navigation";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import LogoutIcon from "@/assets/log-out.svg";

const Navbar = () => {
  const { ready, user, login, logout, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const w0 = wallets[0];
  // console.log(user);
  const [isWithdraw, setIsWithdraw] = useState(false);
  const [isDeposite, setIsDeposite] = useState(false);
  const [isMint, setIsMint] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/deposit") setIsDeposite(true);
    else setIsDeposite(false);

    if (pathname === "/withdraw") setIsWithdraw(true);
    else setIsWithdraw(false);

    if (pathname === "/mint") setIsMint(true);
    else setIsMint(false);
  }, [pathname]);

  //   console.log(account)
  const accountAddress = w0?.address?.slice(0, 6)?.toLocaleLowerCase();

  return (
    <div className="mt-10 z-50">
      {authenticated && !isDeposite && !isWithdraw && !isMint && (
        <div className="w-full flex justify-between  text-[#02200D]">
          <p className="bg-[#BCD0FC]">{accountAddress + "..."}</p>
          <Image src={LogoutIcon} alt="logout" onClick={logout} />
        </div>
      )}

      {authenticated && isDeposite && (
        <div className="w-full text-center flex items-center justify-between">
          <Image src={BackImg} alt="back" onClick={() => router.push("/")} />{" "}
          <p>Deposit</p> <p></p>
        </div>
      )}

      {authenticated && isWithdraw && (
        <div className="w-full text-center flex items-center justify-between">
          <Image src={BackImg} alt="back" onClick={() => router.push("/")} />{" "}
          <p>Withdraw</p> <p></p>
        </div>
      )}

      {authenticated && isMint && (
        <div className="w-full text-center flex items-center justify-between">
          <Image src={BackImg} alt="back" onClick={() => router.push("/")} />{" "}
          <p>Mint Bugs</p> <p></p>
        </div>
      )}
    </div>
  );
};

export default Navbar;

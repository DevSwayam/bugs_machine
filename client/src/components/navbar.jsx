"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import BackImg from "@/assets/backarraow.svg";
// import { WalletInfo } from "./walletInfo";
import { usePathname, useRouter } from "next/navigation";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import LogoutIcon from "@/assets/log-out.svg";
import { IoMdArrowBack } from "react-icons/io";

const Navbar = () => {
  const { logout, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const w0 = wallets[0];
  const [isWithdraw, setIsWithdraw] = useState(false);
  const [isDeposite, setIsDeposite] = useState(false);
  const [isMint, setIsMint] = useState(false);
  const [info, setInfo] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/deposit") setIsDeposite(true);
    else setIsDeposite(false);

    if (pathname === "/withdraw") setIsWithdraw(true);
    else setIsWithdraw(false);

    if (pathname === "/mint") setIsMint(true);
    else setIsMint(false);

    if (pathname === "/info") setInfo(true);
    else setInfo(false);
  }, [pathname]);

  const accountAddress = w0?.address?.slice(0, 6)?.toLocaleLowerCase();

  return (
    // mt-10
    <div className="z-50 mt-10">
      {authenticated && !isDeposite && !isWithdraw && !isMint && !info && (
        <div className="w-full flex justify-between items-center text-[#02200D]">
          <IoMdArrowBack
            className="text-[#BCD0FC] text-2xl"
            onClick={() => router.push("/")}
          />
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

      {info && (
        <div className="w-full text-center flex items-center justify-between">
          <Image src={BackImg} alt="back" onClick={() => router.push("/")} />{" "}
          <p>Bug Slot Machine</p> <p></p>
        </div>
      )}
    </div>
  );
};

export default Navbar;

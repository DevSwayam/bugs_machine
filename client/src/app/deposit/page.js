"use client";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import Deposit from "./deposit";
import DepositLoading from "./depositLoading";

const Navbar = dynamic(() => import("@/components/navbar"), { ssr: false });

const Page = () => {
  const [depositAmmount, setDepositAmmount] = useState(0);
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-screen flex items-center justify-center z-50">
      <div className="grid grid-cols-2 grid-rows-6 h-screen w-full md:max-w-[400px] px-4 md:px-0">
        <div className="col-span-2">
          <Navbar />
        </div>
        <div className="col-span-2 row-span-4">
          {loading ? (
            <DepositLoading />
          ) : (
            <Deposit
              depositAmmount={depositAmmount}
              setDepositAmmount={setDepositAmmount}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;

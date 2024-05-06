import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const Balance = ({ allowed, setAllowed, bugBalance }) => {
  // const { address } = account;
  const [balanceData, setBalanceData] = useState(0);

  useEffect(() => {
    // fetchData();
  }, []);
  return (
    <div className="w-full flex flex-col justify-between items-center text-[#BCD0FC]">
      <div className="w-full flex">
        <div className="flex justify-between w-full">
          {/* <p className="text-sm mb-2">Allowance:</p> */}
          <p className="text-left ">Allowance: </p>
          <p>{allowed.slice(0, -18)}Bugs</p>
        </div>
      </div>
      <div className="w-full flex">
        <div className="flex justify-between w-full">
          {/* <p className="text-sm mb-2">Balance:</p> */}
          <p className="text-left ">Balance: </p>
          <p>{bugBalance === "0" ? "0" : bugBalance.slice(0, -18)}Bugs</p>
        </div>
      </div>
      <div className="w-full grid gap-2 grid-cols-2 mt-4">
        <Link href="/deposit">
          <Button className="text-[#79A2F8] bg-[#05225F] hover:bg-[#05225F]/60 w-full">
            Deposit
          </Button>
        </Link>
        <Link href="/withdraw">
          <Button className="text-[#79A2F8] bg-[#05225F] hover:bg-[#05225F]/60 w-full">
            Withdraw
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Balance;

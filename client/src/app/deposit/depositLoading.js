import React from "react";
import Bug from "@/assets/bugs.png";
import Image from "next/image";

const DepositLoading = () => {
  return (
    <div className="h-full w-full flex flex-col gap-4 items-center justify-center">
      <Image width={100} height={100} src={Bug} alt="loader" />
      <div className="grid gap-1">
        <p className="text-xl text-[#3FF480]">Depositing</p>
        <p className="text-[#056126]">Takes 8-10s...</p>
      </div>
    </div>
  );
};

export default DepositLoading;

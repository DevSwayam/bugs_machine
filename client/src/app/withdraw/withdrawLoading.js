import React from "react";
import Blood from "@/assets/blood.png";
import Image from "next/image";

const WithdrawLoading = () => {
  return (
    <div className="h-full w-full flex flex-col gap-4 items-center justify-center">
      <Image width={100} height={100} src={Bug} alt="loader" />
      <div className="grid gap-1">
        <p className="text-xl text-[#FF4EF8]">Withdrawing</p>
        <p className="text-[#FB55F8]">Takes 8-10s...</p>
      </div>
    </div>
  );
};

export default WithdrawLoading;

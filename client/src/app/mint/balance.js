import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const BugBalance = ({ bugBalance, mintBugs, btnDisabled }) => {
  return (
    <div className="w-full text-[#BCD0FC] grid gap-7">
      {/* <p className="text-left text-xl">Mint Bugs</p> */}
      <div className="relative">
        <p className="text-left text-sm mt-3">
          Available:{bugBalance.slice(0, -18)}
        </p>
      </div>

      <Button
        className="bg-[#3673F5] hover:bg-[#3673F5]/60 w-full"
        onClick={mintBugs}
        disabled={btnDisabled}>
        Mint Bugs
      </Button>
    </div>
  );
};

export default BugBalance;

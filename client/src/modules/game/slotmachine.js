import React, { useEffect } from "react";
import Row1 from "@/components/reels/row1";
import Row2 from "@/components/reels/row2";
import Row3 from "@/components/reels/row3";
import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";

const SlotMachine = ({
  bettingAmount,
  // forceWithdrawal,
  spin,
  ring1,
  ring2,
  ring3,
  play,
  betSuccess,
  start,
  noBalancePopUp,
}) => {
  return (
    <div>
      {/* <p className="text-center -mt-10 my-4 text-2xl text-[#BCD0FC]">Slot Machine</p> */}
      {/* <div className="mb-8 flex flex-col items-center justify-between w-full h-6">
        <div className="w-full flex items-center justify-between">
          <p>Balance</p>
          <p>0 Bugs</p>
        </div>
        <div className="w-full flex items-center justify-between">
          <p>Wining Amount</p>
          <p>0 Bugs</p>
        </div>
      </div> */}
      <div className="grid grid-cols-3 gap-4 h-[293px] overflow-hidden rounded-lg">
        <div className="border border-gray-500 overflow-hidden flex flex-col items-center">
          {<Row1 spin={spin} ring1={ring1} />}
        </div>
        <div className="border border-gray-500 overflow-hidden flex flex-col items-center">
          {<Row2 spin={spin} ring2={ring2} />}
        </div>
        <div className="border border-gray-500 overflow-hidden flex flex-col items-center">
          {<Row3 spin={spin} ring3={ring3} />}
        </div>
      </div>
      {noBalancePopUp ? (
        <div>
            <div>
              <Button
                disabled={true}
                className="w-full mt-4 text-black"
              >
              You Dont have credits.
              </Button>
            </div>
        </div>
      ) : (
        <div>
          {betSuccess && (
            <div>
              <Button
                onClick={play}
                disabled={start}
                className="w-full mt-4 text-black"
              >
                {start
                  ? "Spinning BUGS"
                  : `Bet ${
                      bettingAmount === "0" ? "0" : bettingAmount.slice(0, -18)
                    } Bugs`} 🪲
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SlotMachine;

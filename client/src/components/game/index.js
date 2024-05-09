import React, { useEffect } from "react";
import Row1 from "../reels/row1";
import Row2 from "../reels/row2";
import Row3 from "../reels/row3";
import Bet from "./bet";
import { Button } from "../ui/button";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";

const Game = ({
  forceWithdrawal,
  spin,
  ring1,
  ring2,
  ring3,
  betAmmount,
  setBetAmmount,
  authenticated,
  setBetSuccess,
  play,
  betSuccess,
  start,
}) => {
  const { login } = usePrivy();

  const handleLogin = () => {
    console.log("login btn Clicked!");
    login();
  };

  return (
    <div>
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
      {authenticated ? (
        <div>
          {betSuccess ? (
            <div>
              <Button
                onClick={play}
                disabled={start}
                className="w-full mt-4 text-black">
                {start ? "Loading..." : "Bet 100 Bugs"}
              </Button>
              <div className="grid grid-cols-2 text-xs mt-4 gap-4 col-span-2">
                <Link href={"/mint"}>
                  <p className="underline">Mint Test Bugs</p>
                </Link>
                <p
                  className="text-right cursor-pointer"
                  onClick={forceWithdrawal}>
                  Force withdrawal
                </p>
              </div>
            </div>
          ) : (
            <div>
              <Bet betAmmount={betAmmount} setBetAmmount={setBetAmmount} />
            </div>
          )}
        </div>
      ) : (
        <Button className="w-full mt-8 text-black" onClick={handleLogin}>
          Connect
        </Button>
      )}
    </div>
  );
};

export default Game;

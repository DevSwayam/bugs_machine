import React from "react";
import Row1 from "../reels/row1";
import Row2 from "../reels/row2";
import Row3 from "../reels/row3";
import Bet from "./bet";
import { Button } from "../ui/button";
import { usePrivy } from "@privy-io/react-auth";
// import ConnectWallet from "../connectWallet";

const Game = ({
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
}) => {
  const { login } = usePrivy();
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
            <Button onClick={play} className="w-full mt-4">
              Play
            </Button>
          ) : (
            <div>
              <Bet betAmmount={betAmmount} setBetAmmount={setBetAmmount} />
            </div>
          )}
        </div>
      ) : (
        <Button className="w-full mt-8" onClick={login}>
          Connect
        </Button>
      )}
    </div>
  );
};

export default Game;

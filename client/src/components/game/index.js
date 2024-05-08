import React, { useEffect } from "react";
import Row1 from "../reels/row1";
import Row2 from "../reels/row2";
import Row3 from "../reels/row3";
import Bet from "./bet";
import { Button } from "../ui/button";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";

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
  start,
}) => {
  const { login } = usePrivy();

  useEffect(() => {
    const audioElement = document.getElementById("backgroundMusic");
    if (!audioElement) return; // Return if audio element is not found

    if (start) {
      audioElement.play();
    } else {
      audioElement.pause();
    }
  }, [start]);

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
                Bet 100 Bugs
              </Button>
              <div className="col-span-2 mt-5 text-center">
                <Link href={"/mint"}>
                  <p>Mint Test Bugs</p>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <Bet betAmmount={betAmmount} setBetAmmount={setBetAmmount} />
            </div>
          )}
        </div>
      ) : (
        <Button className="w-full mt-8 text-black" onClick={login}>
          Connect
        </Button>
      )}
      {/* Make sure to replace 'src' with the correct path to your audio file */}
      <audio
        id="backgroundMusic"
        src="./final_tune.mp3"
        className="w-0 h-0"
        autoPlay
        loop
      />
    </div>
  );
};

export default Game;

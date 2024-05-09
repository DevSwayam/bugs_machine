import { AlertInfo } from "@/components/infoAlert";
import Navbar from "@/components/navbar";
import React from "react";

const Index = () => {
  return (
    <div className="w-screen flex items-center justify-center ga z-50">
      <div className="flex flex-col gap-5 h-screen w-full md:max-w-4xl px-4 md:px-0">
        <div className="col-span-2">
          <Navbar />
        </div>

        <div className="col-span-2">
          <AlertInfo
            note={"Instructions"}
            desc={
              <ol className="list-decimal pl-4 pt-2">
                <li>Deposit at least 100 BUGS to play.</li>
                <li>Spin the machine for a chance to win big:</li>
                <ul className="list-disc pl-4 pt-2">
                  <li>20%: Double your bet </li>
                  <li>10%: Get 1.5x your bet</li>
                  <li>20%: Get your bet back</li>
                  <li>
                    50%: Lose your bet If the machine malfunctions, refresh and
                    try again force withdrawal of bugs after one hour . Good
                    luck!
                  </li>
                </ul>
              </ol>
            }
          />
        </div>

        <div className="col-span-2 row-span-2">
          <AlertInfo
            note={"Note"}
            desc={
              <ul className="list-disc pl-4 pt-2">
                <li>
                  You need to have at least 100 BUGS to spin the slot machine.
                </li>
                <li>
                  You need to deposit at least 100 BUGS in the slot machine to
                  be able to play.
                </li>
              </ul>
            }
          />
        </div>
      </div>
    </div>
    // <div className="h-[100vh] md:max-w-xl flex flex-col items-center justify-start mt-12 gap-12">
    //   <Navbar />
    //   <h1>Bug Slot Machine</h1>
    //

    // </div>
  );
};

export default Index;

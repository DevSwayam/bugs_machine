import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { usePrivy } from "@privy-io/react-auth";
import Lottie from "lottie-react";
import LoadingAnimation from "@/assets/bloodDropLoading.json";
import { FaCircleInfo } from "react-icons/fa6";

const Hero = () => {
  const { login, authenticated, logout, ready } = usePrivy();

  return (
    <section>
      {ready ? (
        <div>
          <div className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
            <div className="flex items-center justify-center gap-4">
              <Badge
                className={
                  "bg-secondary hover:bg-muted text-md flex justify-between gap-3 text-foreground"
                }>
                <p>🎮</p>
                <p>Spin, Win, Earn, Repeat.</p>
              </Badge>
            </div>
            <div className="flex flex-col items-center gap-4">
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text text-center">
                {/* <span className="bg-green-400">TextHub</span> */}
                <span className="text-red-500">Bloody</span>{" "}
                <span className="text-green-500">Bugs</span>{" "}
                <span className="text-blue-500">Battle</span>
                {/* <br className="hidden sm:inline" /> */}
              </h1>
              <p className="max-w-[700px] text-sm text-muted-foreground text-center">
              Exhausted by the perennial quandary of financial insufficiency? Embark on a speculative venture with the Bugs Slot Machine that utilizes utilizes <a
                target="_blank"
                href="https://www.inco.org/"
                className="underline text-blue-500 cursor-pointer hover:text-blue-600">
                inco.org
              </a> as the confidentiality layer for the random number! It behooves us to declare that the Machine remains bereft of official audits as Inco is in Testnet 1 Alpha, its security remains dubious, and its operational integrity may suffer from inherent flaws. Should you choose to engage in this endeavor, proceed with judicious caution. We value your feedback! Reach out here:<a
                target="_blank"
                href="https://forms.gle/XAcerorwBgWZzxRJ8"
                className="underline text-blue-500 cursor-pointer hover:text-blue-600">
                Form
              </a>
              </p>
              <div className="flex justify-center items-center gap-3">
                {authenticated ? (
                  <div className="flex gap-3">
                    <Link href={"/bridge"}>
                      <Button variant={"outline"} className='border-background'>Manage Bugs</Button>
                    </Link>
                    <Link href={"/game"}>
                      <Button className="border-black">Play Game</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex justify-center items-center gap-3">
                    <Button onClick={login}>Login to See more!</Button>{" "}
                  </div>
                )}

                {/* <Button onClick={logout}>logout</Button> */}
              </div>
              <a
                target="_blank"
                href="https://0xswayam.gitbook.io/bus"
                className="underline text-blue-500 cursor-pointer hover:text-blue-600">
                Game Information
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex items-center justify-center">
          <Lottie animationData={LoadingAnimation} loop={true} />
        </div>
      )}
    </section>
  );
};

export default Hero;

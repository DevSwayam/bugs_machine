import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { usePrivy } from "@privy-io/react-auth";
import Lottie from "lottie-react";
import LoadingAnimation from "@/assets/bloodDropLoading.json";

const Hero = () => {
  const { login, authenticated, logout, ready } = usePrivy();

  return (
    <section>
      {ready ? (
        <div>
          {authenticated ? (
            <div className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
              <div className="flex items-center justify-center ">
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
                  {/* <span className="bg-green-400">TextHub</span> */}<span className="text-red-500">Bloody</span> <span className="text-green-500">Bugs</span> <span className="text-blue-500">Battle</span>
                  {/* <br className="hidden sm:inline" /> */}
                </h1>
                <p className="max-w-[700px] text-lg text-muted-foreground text-center">
                Join the Decentralized Thrill of the Slot Machine Game on Inco Network! Fairness Guaranteed, Jackpots Growing!
                </p>
                <div className="flex justify-center items-center gap-3">
                  <Link href={"/bridge"}>
                    <Button variant={"outline"}>Bridge Bugs</Button>
                  </Link>
                  <Link href={"/game"}>
                    <Button>Play Game</Button>
                  </Link>
                  {/* <Button onClick={logout}>logout</Button> */}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center gap-3">
              <Button onClick={login}>Login to See more!</Button>
            </div>
          )}
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

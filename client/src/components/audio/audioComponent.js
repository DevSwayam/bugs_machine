"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const AudioComponent = ({ backgroundImg, children }) => {
  const [backGroundSound, setBackGroundSound] = useState(true);
  const [spinningSound, setSpinningSound] = useState(false);

  useEffect(() => {
    const audioElement = document.getElementById("backgroundMusic");
    const spinningElement = document.getElementById("spinningSound");

    if (backGroundSound) {
      audioElement?.play();
    } else {
      audioElement?.pause();
    }

    if (spinningSound) {
      spinningElement?.play();
    } else {
      spinningElement?.pause();
    }
  }, [backGroundSound, spinningSound]);

  return (
    <div>
      <audio
        id="backgroundMusic"
        src="/bg_sound.mp3"
        className="w-0 h-0 absolute"
        loop
      />
      <audio
        id="spinningSound"
        src="/spinning_sound.mp3"
        className="w-0 h-0 absolute"
        loop
      />
      <div className="min-h-screen bg-black relative w-full overflow-hidden flex flex-col items-center justify-center">
        <Image
          alt="background-image"
          src={backgroundImg}
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 bottom-0"
        />
        <div className="z-50 md:p-0 px-6 w-screen grid items-center justify-center gap-4 h-[100vh] relative">
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AudioComponent;

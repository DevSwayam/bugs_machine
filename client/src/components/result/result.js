import React from "react";
import Blood from "@/assets/blood.png";
import Needle from "@/assets/needle.png";
import Poop from "@/assets/poop.png";
import Skull from "@/assets/skull.png";
import Tube from "@/assets/tube.png";
import Bug from "@/assets/bugs.png";
import Drug from "@/assets/drug.png";

const Result = ({ price, ring3 }) => {
  // console.log(price)
  if (price === 1 && ring3 > 1) {
    return (
      <div className="flex flex-col items-center justify-center">
        <img className="w-20 h-20" src={Needle} alt="Needle" />
        <p className="text-center text-sm">{"You've won "}</p>
      </div>
    );
  } else if (price === 2 && ring3 > 1) {
    return (
      <div className="flex flex-col items-center justify-center">
        <img className="w-20 h-20" src={Poop} alt="Poop" />
        <p className="text-center text-sm">{" You've won "}</p>
      </div>
    );
  } else if (price === 3 && ring3 > 1) {
    return (
      <div className="flex flex-col items-center justify-center">
        <img className="w-20 h-20" src={Skull} alt="Skull" />
        <p className="text-center text-sm">{"You've won "}</p>
      </div>
    );
  } else if (price === 4 && ring3 > 1) {
    return (
      <div className="flex flex-col items-center justify-center">
        <img className="w-20 h-20" src={Tube} alt="Blood" />
        <p className="text-center text-sm">{" You've won "}</p>
      </div>
    );
  } else if (price === 5 && ring3 > 1) {
    return (
      <div className="flex flex-col items-center justify-center">
        <img className="w-20 h-20" src={Bug} alt="Tube" />
        <p className="text-center text-sm">{" You've won "}</p>
      </div>
    );
  } else if (price === 6 && ring3 > 1) {
    return (
      <div className="flex flex-col items-center justify-center">
        <img className="w-20 h-20" src={Drug} alt="Bug" />
        <p className="text-center text-sm">{" You've won "}</p>
      </div>
    );
  } else if (price === 7 && ring3 > 1) {
    return (
      <div className="flex flex-col items-center justify-center">
        <img className="w-20 h-20" src={Blood} alt="Drug" />
        <p className="text-center text-sm">{" You've won "}</p>
      </div>
    );
  } else if (price === 0 && ring3 > 1) {
    return <p className="text-center text-sm">😧 ¡So close! But no luck...</p>;
  } else if (price === 10) {
    return (
      <p className="text-center text-sm">
        🥶 <span style={{ color: `red` }}>Not enough funds</span>{" "}
      </p>
    );
  }
};

export default Result;

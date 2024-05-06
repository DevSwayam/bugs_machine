import React from "react";
import Blood from "@/assets/blood.png";
import Needle from "@/assets/needle.png";
import Poop from "@/assets/poop.png";
import Skull from "@/assets/skull.png";
import Tube from "@/assets/tube.png";
import Bug from "@/assets/bugs.png";
import Drug from "@/assets/drug.png";
import Image from "next/image";
// import Avacado from "../assets/avocado.png";
// import Cherry from "../assets/cherry.png";
// import Eggplant from "../assets/eggplant.png";
// import Graphes from "../assets/graphes.png";

const Row2 = ({ spin, ring2 }) => {
  if (!spin) {
    return (
      <>
        <Image
          width={95}
          height={95}
          src={Skull}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Tube}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Bug}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Drug}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Blood}
          alt="Blood"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Needle}
          alt="Needle"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Poop}
          alt="Poop"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
      </>
    );
  } else if (spin && ring2 == undefined) {
    return (
      <>
        <Image
          width={95}
          height={95}
          src={Blood}
          alt="Blood"
          className="ringMoving2"
        />
        <Image
          width={95}
          height={95}
          src={Needle}
          alt="avacado"
          className="ringMoving2"
        />
        <Image
          width={95}
          height={95}
          src={Poop}
          alt="avacado"
          className="ringMoving2"
        />
        <Image
          width={95}
          height={95}
          src={Skull}
          alt="avacado"
          className="ringMoving2"
        />
        <Image
          width={95}
          height={95}
          src={Tube}
          alt="Tube"
          className="ringMoving1"
        />
        <Image
          width={95}
          height={95}
          src={Bug}
          alt="Bug"
          className="ringMoving1"
        />
        <Image
          width={95}
          height={95}
          src={Drug}
          alt="Drug"
          className="ringMoving1"
        />
      </>
    );
  } else if (ring2 >= 1 && ring2 <= 50) {
    return (
      <>
        <Image
          width={95}
          height={95}
          src={Blood}
          alt="Blood"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Needle}
          alt="Needle"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Poop}
          alt="Poop"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Skull}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Tube}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Bug}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Drug}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
      </>
    );
  } else if (ring2 > 50 && ring2 <= 65) {
    return (
      <>
        <Image
          width={95}
          height={95}
          src={Needle}
          alt="Needle"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Poop}
          alt="Poop"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Skull}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Tube}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Bug}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Drug}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Blood}
          alt="Blood"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
      </>
    );
  } else if (ring2 > 65 && ring2 <= 80) {
    return (
      <>
        <Image
          width={95}
          height={95}
          src={Poop}
          alt="Poop"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Skull}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Tube}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Bug}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Drug}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Blood}
          alt="Blood"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Needle}
          alt="Needle"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
      </>
    );
  } else if (ring2 > 80 && ring2 <= 90) {
    return (
      <>
        <Image
          width={95}
          height={95}
          src={Skull}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Tube}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Bug}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Drug}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Blood}
          alt="Blood"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Needle}
          alt="Needle"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Poop}
          alt="Poop"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
      </>
    );
  } else if (ring2 > 90 && ring2 <= 95) {
    return (
      <>
        <Image
          width={95}
          height={95}
          src={Tube}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Bug}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Drug}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Blood}
          alt="Blood"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Needle}
          alt="Needle"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Poop}
          alt="Poop"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Skull}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
      </>
    );
  } else if (ring2 > 95 && ring2 <= 97.5) {
    return (
      <>
        <Image
          width={95}
          height={95}
          src={Bug}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Drug}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Blood}
          alt="Blood"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Needle}
          alt="Needle"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Poop}
          alt="Poop"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Skull}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Tube}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
      </>
    );
  } else if (ring2 > 97.5 && ring2 <= 95) {
    return (
      <>
        <Image
          width={95}
          height={95}
          src={Drug}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Blood}
          alt="Blood"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Needle}
          alt="Needle"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Poop}
          alt="Poop"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Skull}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Tube}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
        <Image
          width={95}
          height={95}
          src={Bug}
          alt="Skull"
          className="h-[95px] leading-125 text-center text-6xl animate-stop"
        />
      </>
    );
  }
};

export default Row2;

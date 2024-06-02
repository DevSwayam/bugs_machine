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

const Row3 = ({ spin, ring3 }) => {
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
  } else if (spin && ring3 == undefined) {
    return (
      <>
        <Image
          width={95}
          height={95}
          src={Blood}
          alt="Blood"
          className="ringMoving3"
        />
        <Image
          width={95}
          height={95}
          src={Needle}
          alt="avacado"
          className="ringMoving3"
        />
        <Image
          width={95}
          height={95}
          src={Poop}
          alt="avacado"
          className="ringMoving3"
        />
        <Image
          width={95}
          height={95}
          src={Skull}
          alt="avacado"
          className="ringMoving3"
        />
        <Image
          width={95}
          height={95}
          src={Tube}
          alt="Tube"
          className="ringMoving3"
        />
        <Image
          width={95}
          height={95}
          src={Bug}
          alt="Bug"
          className="ringMoving3"
        />
        <Image
          width={95}
          height={95}
          src={Drug}
          alt="Drug"
          className="ringMoving3"
        />
      </>
    );
  } else if (ring3 >= 1 && ring3 <= 50) {
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
  } else if (ring3 > 50 && ring3 <= 65) {
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
  } else if (ring3 > 65 && ring3 <= 80) {
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
  } else if (ring3 > 80 && ring3 <= 90) {
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
  } else if (ring3 > 90 && ring3 <= 95) {
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
  } else if (ring3 > 95 && ring3 <= 97.5) {
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
  } else if (ring3 > 97.5 && ring3 <= 95) {
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

export default Row3;

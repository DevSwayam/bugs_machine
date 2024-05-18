import React from "react";
import Avacado from "../assets/avocado.png";
import Cherry from "../assets/cherry.png";
import Eggplant from "../assets/eggplant.png";
import Graphes from "../assets/graphes.png";

const Row2 = ({ spin, ring2 }) => {
  if (!spin) {
    return (
      <>
        <img
          src={Graphes}
          alt="graphes"
          className="h-[125px] leading-125 text-center text-6xl animate-stop"
        />
        <img
          src={Avacado}
          alt="avacado"
          className="h-[125px] leading-125 text-center text-6xl animate-stop"
        />
        <img
          src={Cherry}
          alt="cherry"
          className="h-[125px] leading-125 text-center text-6xl animate-stop"
        />
        <img
          src={Eggplant}
          alt="eggplant"
          className="h-[125px] leading-125 text-center text-6xl animate-stop"
        />
      </>
    );
  } else if (spin && ring2 == undefined) {
    return (
      <>
        <img src={Avacado} alt="avacado" className="ringMoving2" />
        <img src={Cherry} alt="avacado" className="ringMoving2" />
        <img src={Eggplant} alt="avacado" className="ringMoving2" />
        <img src={Graphes} alt="avacado" className="ringMoving2" />
      </>
    );
  } else if (ring2 >= 1 && ring2 <= 50) {
    return (
      <>
        <img
          src={Avacado}
          alt="avacado"
          className="h-[125px] leading-125 text-center text-6xl animate-stop"
        />
        <img
          src={Cherry}
          alt="cherry"
          className="h-[125px] leading-125 text-center text-6xl animate-stop"
        />
        <img
          src={Eggplant}
          alt="eggplant"
          className="h-[125px] leading-125 text-center text-6xl animate-stop"
        />
        <img
          src={Graphes}
          alt="graphes"
          className="h-[125px] leading-125 text-center text-6xl animate-stop"
        />
      </>
    );
  } else if (ring2 > 50 && ring2 <= 75) {
    return (
      <>
        <img
          src={Cherry}
          alt="cherry"
          className="h-[125px] leading-125 text-center text-6xl animate-stop"
        />
        <img
          src={Eggplant}
          alt="eggplant"
          className="h-[125px] leading-125 text-center text-6xl animate-stop"
        />
        <img
          src={Graphes}
          alt="graphes"
          className="h-[125px] leading-125 text-center text-6xl animate-stop"
        />
        <img
          src={Avacado}
          alt="avacado"
          className="h-[125px] leading-125 text-center text-6xl animate-stop"
        />
      </>
    );
  } else if (ring2 > 75 && ring2 <= 95) {
    return (
      <>
        <img
          src={Eggplant}
          alt="eggplant"
          className="h-[125px] leading-125 text-center text-6xl animate-stop"
        />
        <img
          src={Graphes}
          alt="graphes"
          className="h-[125px] leading-125 text-center text-6xl animate-stop"
        />
        <img
          src={Avacado}
          alt="avacado"
          className="h-[125px] leading-125 text-center text-6xl animate-stop"
        />
        <img
          src={Cherry}
          alt="cherry"
          className="h-[125px] leading-125 text-center text-6xl animate-stop"
        />
      </>
    );
  } else if (ring2 > 95 && ring2 <= 100) {
    return (
      <>
        <img
          src={Graphes}
          alt="graphes"
          className="h-[125px] leading-125 text-center text-6xl animate-stop"
        />
        <img
          src={Avacado}
          alt="avacado"
          className="h-[125px] leading-125 text-center text-6xl animate-stop"
        />
        <img
          src={Cherry}
          alt="cherry"
          className="h-[125px] leading-125 text-center text-6xl animate-stop"
        />
        <img
          src={Eggplant}
          alt="eggplant"
          className="h-[125px] leading-125 text-center text-6xl animate-stop"
        />
      </>
    );
  }
};

export default Row2;

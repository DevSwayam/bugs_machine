import React from "react";
import Avacado from "../assets/avocado.png";
import Cherry from "../assets/cherry.png";
import Eggplant from "../assets/eggplant.png";
import Graphes from "../assets/graphes.png";

const Row3 = ({ spin, ring3 }) => {
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
  } else if (spin && ring3 == undefined) {
    return (
      <>
        <img src={Avacado} alt="avacado" className="ringMoving3" />
        <img src={Cherry} alt="avacado" className="ringMoving3" />
        <img src={Eggplant} alt="avacado" className="ringMoving3" />
        <img src={Graphes} alt="avacado" className="ringMoving3" />
      </>
    );
  } else if (ring3 >= 1 && ring3 <= 50) {
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
  } else if (ring3 > 50 && ring3 <= 75) {
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
  } else if (ring3 > 75 && ring3 <= 95) {
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
  } else if (ring3 > 95 && ring3 <= 100) {
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

export default Row3;

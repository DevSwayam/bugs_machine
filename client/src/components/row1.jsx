import React from "react";
import Avacado from "../assets/avocado.png";
import Cherry from "../assets/cherry.png";
import Eggplant from "../assets/eggplant.png";
import Graphes from "../assets/graphes.png";

const Row1 = ({ spin, ring1 }) => {
  if (!spin) {
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
  } else if (spin && ring1 == undefined) {
    return (
      <>
        <img src={Avacado} alt="avacado" className="ringMoving1" />
        <img src={Cherry} alt="avacado" className="ringMoving1" />
        <img src={Eggplant} alt="avacado" className="ringMoving1" />
        <img src={Graphes} alt="avacado" className="ringMoving1" />
      </>
    );
  } else if (ring1 >= 1 && ring1 <= 50) {
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
  } else if (ring1 > 50 && ring1 <= 75) {
    return (
      <>
        {/* FIND */}
        {/* <div className="h-[125px] leading-125 text-center text-6xl animate-stop">🍇</div>
            <div className="h-[125px] leading-125 text-center text-6xl animate-stop">🍊</div>
            <div className="h-[125px] leading-125 text-center text-6xl animate-stop">🥭</div>
            <div className="h-[125px] leading-125 text-center text-6xl animate-stop">🍓</div> */}
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
  } else if (ring1 > 75 && ring1 <= 95) {
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
  } else if (ring1 > 95 && ring1 <= 100) {
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

export default Row1;

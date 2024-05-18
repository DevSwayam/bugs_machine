import React from "react";
import Avacado from "../assets/avocado.png";
import Cherry from "../assets/cherry.png";
import Eggplant from "../assets/eggplant.png";
import Graphes from "../assets/graphes.png";

const Result = ({ price, ring3 }) => {
  if (price === 1 && ring3 > 1) {
    return (
      <div>
        <img src={Cherry} alt="cherry" />
        <p className="">{"You've won "}</p>
      </div>
    );
  } else if (price === 2 && ring3 > 1) {
    return (
      <div>
        <img src={Eggplant} alt="eggplant" />
        <p className="">{" You've won "}</p>
      </div>
    );
  } else if (price === 3 && ring3 > 1) {
    return (
      <div>
        <img src={Graphes} alt="graphes" />
        <p className="">{"You've won "}</p>
      </div>
    );
  } else if (price === 4 && ring3 > 1) {
    return (
      <div>
        <img src={Avacado} alt="avacado" />
        <p className="">{" You've won "}</p>
      </div>
    );
  } else if (price === 0 && ring3 > 1) {
    return <p className="">😧 ¡So close! But no luck...</p>;
  } else if (price === 10) {
    return (
      <p className="">
        🥶 <span style={{ color: `red` }}>Not enough funds</span>{" "}
      </p>
    );
  }
};

export default Result;

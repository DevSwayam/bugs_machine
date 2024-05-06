import React from "react";
// import * as buffer from "buffer";
import App from "./app";
// import MatrixRainEffect from "@/components/Matrixrain";
// window.Buffer = buffer.Buffer;

const redStone = {
  id: 17001,
  network: "Red Stone Network",
  name: "RED",
  nativeCurrency: {
    name: "RED",
    symbol: "RED",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.holesky.redstone.xyz/"],
    },
    public: {
      http: ["https://rpc.holesky.redstone.xyz/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://explorer.holesky.redstone.xyz/",
    },
  },
};

const SlotMachine = () => {
  return (
    <div className="">
      <App />
    </div>
  );
};

export default SlotMachine;

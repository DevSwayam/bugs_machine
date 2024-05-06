import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Bet = ({ betAmmount, setBetAmmount }) => {
  return (
    <div className="relative -bottom-8 grid">
      <div className="relative">
        <Input
          className="py-2 px-2 bg-transparent border-[#3FF480] text-[#3FF480] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          value={betAmmount}
          onChange={(e) => setBetAmmount(e.target.value)}
          disabled={betAmmount <= 0}
        />
        <p className="absolute top-2 right-4 text-[#056126]">$BUGS</p>
      </div>

      <Button className="mt-3" disabled={betAmmount <= 0}>
        Bet
      </Button>
    </div>
  );
};

export default Bet;

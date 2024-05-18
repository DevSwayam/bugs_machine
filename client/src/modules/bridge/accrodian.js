import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  approveBugs,
  depositBugsCall,
  mintBugs,
  withdrawBugs,
} from "@/utils/redstoneHelpers";
import { useState } from "react";
import { PlayGamePopup } from "./popup";

export function BridgeAccordian({ w0 }) {
  const [isApprove, setIsApprove] = useState(false);
  const [isBugsLocked, setIsBugsLocked] = useState(false);
  const [depositAmount, setDepositAmount] = useState("0");
  const [bridgeAmount, setBridgeAmount] = useState("0");
  // const [isMintSuccess, setIsMintSuccess] = useState(false);

  return (
    <Accordion type="single" collapsible className="w-full">
      {isBugsLocked && <PlayGamePopup isOpen={isBugsLocked} />}
      <AccordionItem value="item-1">
        <AccordionTrigger> Bridge Bugs</AccordionTrigger>
        <AccordionContent className="bg-secondary p-2">
          {isApprove ? (
            <div>
              <p>Now, bridge the bugs to play the game</p>
              <Input
                className="py-2 px-2 mt-4 bg-transparent border-[#3673F5] text-[#3673F5] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={bridgeAmount}
                onChange={(e) => setBridgeAmount(e.target.value)}
              />
              <Button
                className="bg-[#3673F5] hover:bg-[#3673F5]/60 mt-2 w-full"
                onClick={() =>
                  depositBugsCall(w0, bridgeAmount, setIsBugsLocked)
                }>
                Deposit Bugs
              </Button>
            </div>
          ) : (
            <div>
              <p>You, first need to approve the smart contract</p>
              <Input
                className="py-2 px-2 mt-4 bg-transparent border-[#3673F5] text-[#3673F5] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
              <Button
                className="bg-[#3673F5] hover:bg-[#3673F5]/60 mt-2 w-full"
                onClick={() => approveBugs(w0, depositAmount, setIsApprove)}>
                Approve Bugs
              </Button>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Withdraw Bugs</AccordionTrigger>
        <AccordionContent className="bg-secondary p-2">
          <div>
            <p>You can withdraw all your remaining bugs</p>
            <Button
              className="bg-[#3673F5] hover:bg-[#3673F5]/60 mt-2 w-full"
              onClick={() => withdrawBugs(w0)}>
              Withdraw Bugs
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Mint Test Bugs</AccordionTrigger>
        <AccordionContent className="bg-secondary p-2">
          <div>
            <p>You can mint test bugs to play</p>
            <Button
              className="bg-[#3673F5] hover:bg-[#3673F5]/60 mt-2 w-full"
              onClick={() => mintBugs(w0)}>
              Mint Bugs
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
      {/* <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It&apos;s animated by default, but you can disable it if you
          prefer.
        </AccordionContent>
      </AccordionItem> */}
    </Accordion>
  );
}

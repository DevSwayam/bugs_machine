import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DepositBugAlert = ({
  bridgeAmount,
  setBridgeAmount,
  depositBugsCall,
  setIsBugsLocked,
  w0,
  loading,
  setLoading,
  currentState,
  setCurrentState,
  bugsApprovalAmount,
  setReloadPage
}) => {
  // const [deposite, setDeposite] = useState("0");
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="py-6 flex items-center justify-center transition-all ease-in-out duration-300 border border-[#BCD0FC]/40 hover:bg-[#BCD0FC] hover:text-blue-900 cursor-pointer text-center">
          Deposit BUGS
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deposit Bugs</AlertDialogTitle>
          <AlertDialogDescription>
            <div>
              <ul className="list-disc pl-4 pt-2">
                <li>Now, deposit the bugs to play the game.</li>
                <li>
                  You can deposit upto{" "}
                  <span className="text-[#3FF480]">
                    {bugsApprovalAmount === "0"
                      ? "0"
                      : bugsApprovalAmount.slice(0, -18)}
                  </span>{" "}
                  amount.
                </li>
              </ul>
              <Input
                className="py-2 px-2 mt-4 bg-transparent border-[#3FF480] text-[#3FF480] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={bridgeAmount}
                onChange={(e) => setBridgeAmount(e.target.value)}
              />
              {/* <Button
                className="bg-[#3673F5] hover:bg-[#3673F5]/60 mt-2 w-full"
                onClick={() =>
                  depositBugsCall(w0, bridgeAmount, setIsBugsLocked)
                }>
                Deposit Bugs
              </Button> */}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            // className="bg-[#3673F5] hover:bg-[#3673F5]/60 mt-2 w-full"
            onClick={(e) => {
              // e.preventDefault();
              depositBugsCall(
                w0,
                bridgeAmount,
                setIsBugsLocked,
                loading,
                setLoading,
                currentState,
                setCurrentState,
                setReloadPage
              );
            }}>
            Deposit Bugs
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DepositBugAlert;

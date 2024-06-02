import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { checkAllowanceOfUser } from "@/utils/bridgeHelpers";
import { usePrivy } from "@privy-io/react-auth";

const ApproveBugs = ({
  setReloadPage,
  depositAmount,
  setDepositAmount,
  setIsApprove,
  setWaitingForApproval,
  waitingForApproval,
  approveBugs,
  w0,
  bugsBalance,
  bugsApprovalAmount
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="py-6 flex items-center justify-center transition-all ease-in-out duration-300 border border-[#BCD0FC]/40 hover:bg-[#BCD0FC] hover:text-blue-900 cursor-pointer text-center">
          Approve BUGS
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve Bugs</AlertDialogTitle>
          <AlertDialogDescription>
            <div>
              <ul className="list-disc pl-4 pt-2">
                <li>You first need to approve the smart contract.</li>
                <li>
                  You've total{" "}
                  <span className="text-[#3FF480]">
                    {bugsBalance === "0" ? "0" : bugsBalance.slice(0, -18)}
                  </span>{" "}
                  bugs balance &{" "}
                  <span className="text-[#3FF480]">
                    {bugsApprovalAmount === "0"
                      ? "0"
                      : bugsApprovalAmount.slice(0, -18)}
                  </span>{" "}
                  bugs has been approved to deposit.
                </li>
              </ul>
              {/* <div>
                <p>Bugs Balance</p>
                <p>Approved Amount</p>
              </div> */}
              <Input
                className="py-2 px-2 mt-4 bg-transparent border-[#3FF480] text-[#3FF480] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
              {/* <Button
                className={`bg-[#3673F5] hover:bg-[#3673F5]/60 mt-2 w-full ${
                  waitingForApproval ? "cursor-not-allowed opacity-50" : ""
                }`}
                onClick={() =>
                  approveBugs(
                    w0,
                    depositAmount,
                    setIsApprove,
                    setWaitingForApproval
                  )
                }>
                {waitingForApproval ? "Approving..." : "Approve Bugs"}
              </Button> */}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={`${
              waitingForApproval ? "cursor-not-allowed opacity-50" : ""
            }`}
            // onClick={() => mintBugs(w0)}
            onClick={(e) => {
              // e.preventDefault();
              approveBugs(
                w0,
                depositAmount,
                setIsApprove,
                setWaitingForApproval,
                setReloadPage
              );
            }}>
            Approve Bugs
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ApproveBugs;

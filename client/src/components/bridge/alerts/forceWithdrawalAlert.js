import React from "react";
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
import { CgDanger } from "react-icons/cg";

const ForceWithdrawalAlert = ({ forceWithdrawBugs, w0 }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="py-6 col-span-2 flex items-center justify-center transition-all ease-in-out duration-300 border border-[#BCD0FC]/40 hover:bg-red-500 hover:text-white cursor-pointer text-center  text-red-500">
          Force Withdrawal
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex gap-2 items-center justify-start">
            {/* <CgDanger className="text-red-400  text-2xl" /> */}
            Force Withdrawal
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div>
              <p>
                You can forcibly withdraw your BUGS only after 5 minutes have
                passed since depositing.
              </p>
              {/* <Button
                className="bg-[#3673F5] hover:bg-[#3673F5]/60 mt-2 w-full"
                onClick={() => forceWithdrawBugs(w0)}>
                Force Withdrawl of Bugs
              </Button> */}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-800 text-white"
            onClick={() => forceWithdrawBugs(w0)}>
            Force Withdrawl
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ForceWithdrawalAlert;

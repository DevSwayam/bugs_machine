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

const WithdrawBugsAlert = ({
  withdrawBugs,
  w0,
  loading,
  setLoading,
  currentState,
  setCurrentState,
  actualBugBalance,
  setReloadPage,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="py-6 col-span-2 flex items-center justify-center transition-all ease-in-out duration-300 border border-[#BCD0FC]/40 hover:bg-red-500 hover:text-white cursor-pointer text-center  text-red-500">
          Withdraw Bugs
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Withdraw Bugs</AlertDialogTitle>
          <AlertDialogDescription>
            <div>
              <p>
                You can withdraw{" "}
                <span className="text-[#3FF480]">
                  {actualBugBalance === "0"
                    ? "0"
                    : actualBugBalance.slice(0, -18)}
                </span>{" "}
                BUGS.
              </p>
              {/* <Button className=" mt-2 w-full">Withdraw Bugs</Button> */}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              withdrawBugs(
                w0,
                loading,
                setLoading,
                currentState,
                setCurrentState,
                setReloadPage
              )
            }>
            Withdraw Bugs
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WithdrawBugsAlert;

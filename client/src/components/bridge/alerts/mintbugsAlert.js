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

const Mintbugs = ({ mintBugs, w0, setReloadPage }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="py-6 flex items-center justify-center transition-all ease-in-out duration-300 border border-[#BCD0FC]/40 hover:bg-[#BCD0FC] hover:text-blue-900 cursor-pointer text-center">
          Mint BUGS
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Mint Bugs</AlertDialogTitle>
          <AlertDialogDescription>
            <div>
              <p>Mint <span className="text-[#3FF480] ">1000</span> test BUGS to start playing!</p>
              <div className="flex items-center justify-center"></div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            // className="bg-[#3673F5] hover:bg-[#3673F5]/60 mt-2 w-full"
            onClick={() => mintBugs(w0,setReloadPage)}>
            Mint BUGS
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Mintbugs;

import React from "react";
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
import { Button } from "@/components/ui/button";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";

const Rules = ({ isInstructionOpen, setIsInstructionOpen }) => {
  return (
    <AlertDialog
      open={isInstructionOpen}
      setIsInstructionOpen={setIsInstructionOpen}>
      {/* <AlertDialogTrigger asChild>
        <div className="py-6 flex items-center justify-center transition-all ease-in-out duration-300 border border-[#BCD0FC]/40 hover:bg-[#BCD0FC] hover:text-blue-900 cursor-pointer text-center">
          Instructions
        </div>
      </AlertDialogTrigger> */}
      <AlertDialogContent>
        <AlertDialogHeader>
          {/* <AlertDialogTitle>Instructions</AlertDialogTitle> */}
          <AlertDialogDescription>
            <div className="space-y-3">
              {/* <p>Mint 1000 test BUGS to start playing!</p>
              <Button
                className="bg-[#3673F5] hover:bg-[#3673F5]/60 mt-2 w-full"
                onClick={() => mintBugs(w0)}>
                Mint Bugs
              </Button> */}
              <div>
                <p className='text-white font-semibold'>How to Deposit?</p>
                <ul className='list-disc pl-4 pt-2'>
                  <li>
                    <span className='text-[#3FF480]'>Step 2</span> = Click "Deposit Bugs" to add tokens.
                  </li>
                </ul>
              </div>
              <div>
                <p className='text-white font-semibold'>How to withdraw?</p>
                <ul className='list-disc pl-4 pt-2'>
                  <li>
                    <span className='text-[#3FF480]'>Withdraw Bugs</span> = Click "Withdraw Bugs" to withdraw tokens.
                  </li>
                </ul>
              </div>


              <Button
                className=" mt-2 w-full"
                onClick={() => {
                  setIsInstructionOpen(false);
                }}>
                Continue
              </Button>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Rules;

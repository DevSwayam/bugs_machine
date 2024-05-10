import { AlertInfo } from "@/components/infoAlert";
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
import { Info } from "lucide-react";

export function AlertDialogComp({ bettingAmount, slotMachineBalance }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="-mt-9 w-full flex justify-end">
          <div>
            <Info className="text-[#3FF480] cursor-pointer" />
          </div>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          {/* <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle> */}
          <AlertDialogDescription>
            <AlertInfo
              note={<p>Instructions</p>}
              desc={
                <ol className="list-decimal pl-4 pt-2">
                  <li>
                    Deposit at least{" "}
                    {bettingAmount === "0" ? "0" : bettingAmount.slice(0, -18)}{" "}
                    BUGS to play.
                  </li>
                  <li>
                    Spin the machine for a chance to win{" "}
                    {slotMachineBalance === "0"
                      ? "0"
                      : slotMachineBalance.slice(0, -18)}{" "}
                    Bugs
                  </li>
                </ol>
              }
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
          <AlertDialogAction className="w-full">Understood!</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

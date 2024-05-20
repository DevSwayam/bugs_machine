import { AlertInfo } from "./infoAlert";
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
import { Info } from "lucide-react";

export function AlertDialogComp({ bettingAmount, jackpot }) {
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
                    Bet{" "}
                    <span className="text-[#3FF480]">
                      {bettingAmount === "0"
                        ? "0 BUGS"
                        : bettingAmount.slice(0, -18) + " Bugs"}
                    </span>{" "}
                    to play.
                  </li>
                  <li>
                    Spin the machine for a chance to win{" "}
                    <span className="text-[#3FF480]">
                      {" "}
                      {jackpot === "0" ? "0" : jackpot.slice(0, -18)} Bugs
                    </span>
                  </li>
                  <li>You have a 1/2000 chance of hitting the jackpot.</li>
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

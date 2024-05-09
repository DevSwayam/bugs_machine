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

export function AlertDialogComp() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="-mt-9 w-full flex justify-end">
          <div>
            <Info />
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
                  <li>Deposit at least 100 BUGS to play.</li>
                  <li>Spin the machine for a chance to win big:</li>
                  <ul className="list-disc pl-4 pt-2">
                    <li>20%: Double your bet </li>
                    <li>10%: Get 1.5x your bet</li>
                    <li>20%: Get your bet back</li>
                    <li>
                      50%: Lose your bet If the machine malfunctions, refresh
                      and try again force withdrawal of bugs after one hour .
                      Good luck!
                    </li>
                  </ul>
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

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

export function AlertDialogComponent({ noPopUpBalance }) {
  console.log(noPopUpBalance)
  return (

    <AlertDialog defaultOpen={true} >
      <AlertDialogContent >
        <AlertDialogHeader>
          <AlertDialogDescription>
          You currently have insufficient credits to play the game.
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

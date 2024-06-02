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
import { useRouter } from "next/navigation";

export function PlayGamePopup({ isOpen }) {
  const router = useRouter();
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>You Can Now Use the Slot Machine</AlertDialogTitle>
          <AlertDialogDescription>
            Please note that as you have just deposited BUGS,{" "}
            <span className="text-red-500">it may take 30 seconds</span> for
            your balance to be reflected.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* <AlertDialogCancel onClick={() =>{console.log('clicked')
           router.refresh()}}>
            Cancel
          </AlertDialogCancel> */}
          <AlertDialogAction>
            <Button onClick={() => router.push("/game")}>Play Game</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

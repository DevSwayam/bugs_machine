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
import { useRouter } from "next/navigation";

export function AlertDialogComponent({ noPopUpBalance }) {
  const router = useRouter();
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
          <AlertDialogAction className="w-full" onClick={()=>{router.push("/bridge")}}>Get Bugs!</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

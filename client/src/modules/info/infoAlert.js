import { Terminal } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AlertInfo({ note, desc }) {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>{note}</AlertTitle>
      <AlertDescription>{desc}</AlertDescription>
    </Alert>
  );
}

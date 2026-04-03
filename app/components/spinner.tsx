import { Loader2 } from "lucide-react";

export function Spinner() {
  return (
    <div role="status" className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

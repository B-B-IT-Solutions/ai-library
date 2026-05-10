"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";

type Props = {
   error: Error & { digest?: string };
   unstable_retry: () => void;
};

const ExploreError = ({ error, unstable_retry }: Props) => {
   useEffect(() => {
      console.error(error);
   }, [error]);

   return (
      <div
         className="flex h-full min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center"
         data-testid="explore-error"
      >
         <AlertTriangle className="h-10 w-10 text-destructive" />
         <h2 className="text-xl font-semibold">Etwas ist schiefgelaufen</h2>
         <p className="max-w-md text-sm text-muted-foreground">
            Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.
         </p>
         <div className="flex gap-2">
            <Button
               onClick={unstable_retry}
               variant="outline"
               className="cursor-pointer"
               data-testid="retry-btn"
            >
               Erneut versuchen
            </Button>
            <Button asChild variant="ghost">
               <Link href="/explore">Zum Entdecken</Link>
            </Button>
         </div>
      </div>
   );
};

export default ExploreError;

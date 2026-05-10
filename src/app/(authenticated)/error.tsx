"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/shadcn/button";

type Props = {
   error: Error & { digest?: string };
   reset: () => void;
};

const AuthenticatedError = ({ error, reset }: Props) => {
   useEffect(() => {
      console.error(error);
   }, [error]);

   return (
      <div
         className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center"
         data-testid="authenticated-error"
      >
         <AlertTriangle className="h-10 w-10 text-destructive" />
         <h2 className="text-xl font-semibold">Etwas ist schiefgelaufen</h2>
         <p className="max-w-md text-sm text-muted-foreground">
            Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.
         </p>
         <Button onClick={reset} variant="outline">
            Erneut versuchen
         </Button>
      </div>
   );
};

export default AuthenticatedError;

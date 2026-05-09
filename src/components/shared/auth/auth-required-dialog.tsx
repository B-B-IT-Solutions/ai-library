"use client";

import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/shadcn/dialog";

type Props = {
   isOpen: boolean;
   onClose: () => void;
   redirectPath: string;
   description?: string;
};

export const AuthRequiredDialog = ({
   isOpen,
   onClose,
   redirectPath,
   description = "Für diese Aktion benötigst du ein Konto.",
}: Props) => {
   return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
         <DialogContent data-testid="auth-required-dialog">
            <DialogHeader>
               <DialogTitle>Anmelden erforderlich</DialogTitle>
               <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col items-end gap-3 sm:flex-col">
               <Button
                  asChild
                  className="w-full cursor-pointer sm:w-auto"
                  data-testid="auth-required-sign-in-btn"
               >
                  <Link href={`/auth/sign-in?redirect=${redirectPath}`}>
                     Anmelden
                  </Link>
               </Button>
               <p className="text-sm text-muted-foreground">
                  Noch kein Konto?{" "}
                  <Link
                     href={`/auth/sign-up?redirect=${redirectPath}`}
                     className="cursor-pointer text-foreground underline underline-offset-4 hover:opacity-80"
                     data-testid="auth-required-register-link"
                  >
                     Registrieren
                  </Link>
               </p>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

"use client";

import { LogIn, UserPlus } from "lucide-react";
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
            <DialogFooter>
               <Button
                  variant="ghost"
                  className="cursor-pointer"
                  onClick={onClose}
                  data-testid="auth-required-cancel-btn"
               >
                  Abbrechen
               </Button>
               <Button
                  asChild
                  variant="outline"
                  className="cursor-pointer"
                  data-testid="auth-required-register-btn"
               >
                  <Link href={`/auth/sign-up?redirect=${redirectPath}`}>
                     <UserPlus className="h-4 w-4" />
                     Registrieren
                  </Link>
               </Button>
               <Button
                  asChild
                  className="cursor-pointer"
                  data-testid="auth-required-sign-in-btn"
               >
                  <Link href={`/auth/sign-in?redirect=${redirectPath}`}>
                     <LogIn className="h-4 w-4" />
                     Anmelden
                  </Link>
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

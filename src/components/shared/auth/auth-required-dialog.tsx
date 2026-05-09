"use client";

import { DialogClose } from "@radix-ui/react-dialog";
import { LogIn, X } from "lucide-react";
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
   onOpenChange: (open: boolean) => void;
   redirectPath: string;
   title?: string;
   description?: string;
};

export const AuthRequiredDialog = ({
   isOpen,
   onOpenChange,
   redirectPath,
   title = "Fast geschafft!",
   description = "Für diese Aktion benötigst du ein Konto.",
}: Props) => {
   return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
         <DialogContent className="gap-6" data-testid="auth-required-dialog">
            <div className="flex justify-center">
               <div className="rounded-full bg-primary/10 p-4">
                  <LogIn className="h-6 w-6 text-primary" />
               </div>
            </div>
            <DialogHeader className="text-center">
               <DialogTitle className="text-center">{title}</DialogTitle>
               <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col items-center gap-3 sm:flex-col">
               <Button
                  asChild={true}
                  size="lg"
                  className="w-full cursor-pointer"
               >
                  <Link
                     href={`/auth/sign-in?redirect=${redirectPath}`}
                     data-testid="sign-in-link"
                  >
                     Anmelden
                  </Link>
               </Button>
               <p className="text-center text-sm text-muted-foreground">
                  Noch kein Konto?{" "}
                  <Link
                     href={`/auth/sign-up?redirect=${redirectPath}`}
                     className="cursor-pointer font-medium text-foreground hover:underline"
                     data-testid="sign-up-link"
                  >
                     Kostenlos starten
                  </Link>
               </p>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

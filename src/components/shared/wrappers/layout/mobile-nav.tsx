"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import {
   Sheet,
   SheetContent,
   SheetTitle,
   SheetTrigger,
} from "@/components/shadcn/sheet";

type Props = {
   authenticated: boolean;
};

export const MobileNav = ({ authenticated }: Props) => {
   const [open, setOpen] = useState(false);

   return (
      <Sheet open={open} onOpenChange={setOpen}>
         <SheetTrigger asChild>
            <Button
               variant="ghost"
               size="icon"
               className="sm:hidden"
               aria-label="Menü öffnen"
               data-testid="mobile-nav-trigger"
            >
               <Menu className="h-10 w-10" />
            </Button>
         </SheetTrigger>
         <SheetContent side="left" className="flex w-64 flex-col p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <nav className="flex flex-col px-4 pt-8">
               <Link
                  href="/explore"
                  onClick={() => setOpen(false)}
                  className="border-b py-4 text-base font-medium text-foreground transition-colors hover:text-primary"
               >
                  Entdecken
               </Link>
               <Link
                  href="http://www.vision-notes.com/pricing"
                  onClick={() => setOpen(false)}
                  className="border-b py-4 text-base font-medium text-foreground transition-colors hover:text-primary"
               >
                  Preise
               </Link>
            </nav>
            <div className="mt-auto border-t px-4 py-6">
               {authenticated ? (
                  <Button
                     asChild
                     className="w-full"
                     onClick={() => setOpen(false)}
                  >
                     <Link href="/">Zur Bibliothek</Link>
                  </Button>
               ) : (
                  <div className="flex flex-col gap-3">
                     <Button
                        asChild
                        variant="outline"
                        className="w-full"
                        onClick={() => setOpen(false)}
                     >
                        <Link
                           href="/auth/sign-in"
                           data-testid="mobile-sign-in-link"
                        >
                           Anmelden
                        </Link>
                     </Button>
                     <Button
                        asChild
                        className="w-full"
                        onClick={() => setOpen(false)}
                     >
                        <Link
                           href="/auth/sign-up"
                           data-testid="mobile-sign-up-link"
                        >
                           Kostenlos starten
                        </Link>
                     </Button>
                  </div>
               )}
            </div>
         </SheetContent>
      </Sheet>
   );
};

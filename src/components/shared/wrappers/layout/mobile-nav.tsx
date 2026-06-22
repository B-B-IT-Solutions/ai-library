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

export const MobileNav = () => {
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
               <Menu className="h-5 w-5" />
            </Button>
         </SheetTrigger>
         <SheetContent side="left" className="w-64 p-0">
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
                  className="py-4 text-base font-medium text-foreground transition-colors hover:text-primary"
               >
                  Preise
               </Link>
            </nav>
         </SheetContent>
      </Sheet>
   );
};

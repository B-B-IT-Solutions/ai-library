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
      <div className="flex justify-end" data-testid="mobile-nav">
         <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild={true}>
               <Button
                  variant="ghost"
                  size="icon"
                  className="sm:hidden"
                  aria-label="Menü öffnen"
                  data-testid="mobile-nav-trigger"
               >
                  <Menu className="h-7 w-7" />
               </Button>
            </SheetTrigger>
            <SheetContent
               side="top"
               className="flex h-screen w-screen flex-col p-0"
            >
               <SheetTitle className="sr-only">Navigation</SheetTitle>
               <nav
                  className="flex flex-col px-4 pt-8"
                  data-testid="navigation"
               >
                  <Link
                     href="/explore"
                     onClick={() => setOpen(false)}
                     className="py-4 text-sm font-medium text-foreground transition-colors hover:text-primary"
                     data-testid="explore-nav-item"
                  >
                     Entdecken
                  </Link>
                  <Link
                     href="http://www.vision-notes.com/pricing"
                     onClick={() => setOpen(false)}
                     className="py-4 text-sm font-medium text-foreground transition-colors hover:text-primary"
                     data-testid="pricing-nav-item"
                  >
                     Preise
                  </Link>
                  <Link
                     href="http://www.vision-notes.com/blog"
                     onClick={() => setOpen(false)}
                     className="py-4 text-sm font-medium text-foreground transition-colors hover:text-primary"
                     data-testid="blog-nav-item"
                  >
                     Blog
                  </Link>
               </nav>
               <div className="mt-auto px-4 py-6">
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
                           className="w-full"
                           onClick={() => setOpen(false)}
                        >
                           <Link
                              href="/auth/sign-up"
                              data-testid="sign-up-link"
                           >
                              Kostenlos starten
                           </Link>
                        </Button>
                        <Button
                           asChild
                           variant="outline"
                           className="w-full"
                           onClick={() => setOpen(false)}
                        >
                           <Link
                              href="/auth/sign-in"
                              data-testid="sign-in-link"
                           >
                              Anmelden
                           </Link>
                        </Button>
                     </div>
                  )}
               </div>
            </SheetContent>
         </Sheet>
      </div>
   );
};

import { ReactNode } from "react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { isAuthenticated } from "@/data/actions/auth-utils";
import { APP_NAME } from "@/lib/constants";

import { MobileNav } from "./mobile-nav";

export type Props = {
   children: ReactNode;
};

export const PublicLayoutWrapper = async ({ children }: Props) => {
   const authenticated = await isAuthenticated();

   const loginBtns = () => {
      if (authenticated) {
         return (
            <Button
               asChild
               size="sm"
               variant="outline"
               data-testid="templates-link"
            >
               <Link href="/">Zur Bibliothek</Link>
            </Button>
         );
      }
      return (
         <div className="flex items-center gap-2 sm:gap-3">
            <Button
               variant="outline"
               size="sm"
               className="sm:h-9 sm:px-4 sm:text-sm"
               asChild={true}
            >
               <Link href="/auth/sign-in" data-testid="sign-in-link">
                  Anmelden
               </Link>
            </Button>
            <Button
               size="sm"
               className="sm:h-9 sm:px-4 sm:text-sm"
               asChild={true}
            >
               <Link href="/auth/sign-up" data-testid="sign-up-link">
                  <span className="sm:hidden">Starten</span>
                  <span className="hidden sm:inline">Kostenlos starten</span>
               </Link>
            </Button>
         </div>
      );
   };

   return (
      <div
         className="flex min-h-screen flex-col bg-background"
         data-testid="public-layout-wrapper"
      >
         <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
               <div className="flex items-center gap-6 sm:gap-8">
                  <Link
                     href="/"
                     className="text-lg font-bold whitespace-nowrap sm:text-xl"
                  >
                     {APP_NAME}
                  </Link>
                  <nav className="hidden items-center gap-6 sm:flex">
                     <Link
                        href="/explore"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                     >
                        Entdecken
                     </Link>
                     <Link
                        href="http://www.vision-notes.com/pricing"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                     >
                        Preise
                     </Link>
                  </nav>
               </div>
               <div className="flex items-center gap-2 sm:gap-3">
                  <div className="hidden sm:flex sm:items-center sm:gap-3">
                     {loginBtns()}
                  </div>
                  <MobileNav authenticated={authenticated} />
               </div>
            </div>
         </header>

         <main className="flex-1">{children}</main>

         <footer className="border-t bg-muted/40 py-6">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
               <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} {APP_NAME}
               </p>
               <nav className="flex flex-wrap gap-x-6 gap-y-2">
                  <Link
                     href="http://www.vision-notes.com/legal/agb"
                     className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                     AGB
                  </Link>
                  <Link
                     href="http://www.vision-notes.com/legal/privacypolicy"
                     className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                     Datenschutz
                  </Link>
                  <Link
                     href="http://www.vision-notes.com/legal/cookies"
                     className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                     Cookies
                  </Link>
               </nav>
            </div>
         </footer>
      </div>
   );
};

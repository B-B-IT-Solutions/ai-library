import { ReactNode } from "react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { isAuthenticated } from "@/data/actions/auth-utils";
import { APP_NAME } from "@/lib/constants";

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
         <div className="flex items-center gap-3">
            <Button variant="outline" asChild={true}>
               <Link href="/auth/sign-in" data-testid="sign-in-link">
                  Anmelden
               </Link>
            </Button>
            <Button asChild={true}>
               <Link href="/auth/sign-up" data-testid="sign-up-link">
                  Kostenlos starten
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
            <div className="max-w-9xl container mx-auto flex items-center justify-between px-4 py-4 sm:px-6">
               <div className="flex items-center gap-8">
                  <Link href="/" className="text-xl font-bold">
                     {APP_NAME}
                  </Link>
                  <nav className="hidden items-center gap-6 md:flex">
                     <Link
                        href="/explore"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                     >
                        Entdecken
                     </Link>
                  </nav>
               </div>
               {loginBtns()}
            </div>
         </header>

         <main className="flex-1">{children}</main>

         <footer className="border-t bg-muted/40 py-6">
            <div className="container mx-auto flex max-w-7xl justify-between px-4 sm:px-6">
               <p className="text-center text-sm text-muted-foreground">
                  © {new Date().getFullYear()} {APP_NAME}
               </p>
               <nav className="hidden items-center gap-6 md:flex">
                  <div className="flex flex-col gap-2">
                     <Link
                        href="http://www.vision-notes.com/legal/agb"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                     >
                        AGB
                     </Link>
                     <Link
                        href="http://www.vision-notes.com/legal/privacypolicy"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                     >
                        Datenschutz
                     </Link>
                     <Link
                        href="http://www.vision-notes.com/legal/cookies"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                     >
                        Cookies
                     </Link>
                  </div>
               </nav>
            </div>
         </footer>
      </div>
   );
};

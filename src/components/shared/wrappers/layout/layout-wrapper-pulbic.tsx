import { ReactNode } from "react";
import Link from "next/link";

import { isAuthenticated } from "@/data/actions/auth-utils";
import { APP_NAME } from "@/lib/constants";

import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";

export type Props = {
   children: ReactNode;
};

export const PublicLayoutWrapper = async ({ children }: Props) => {
   const authenticated = await isAuthenticated();

   return (
      <div
         className="flex min-h-screen flex-col bg-background"
         data-testid="public-layout-wrapper"
      >
         <header className="border-b bg-background">
            <div className="mx-auto flex max-w-7xl items-center px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
               <div className="flex-1">
                  <Link
                     href="/"
                     className="text-lg font-bold whitespace-nowrap sm:text-xl"
                  >
                     {APP_NAME}
                  </Link>
               </div>
               <div className="flex-2">
                  <DesktopNav authenticated={authenticated} />
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

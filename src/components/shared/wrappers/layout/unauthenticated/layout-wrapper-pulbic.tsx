import { ReactNode } from "react";
import Link from "next/link";

import { isAuthenticated } from "@/data/actions/auth-utils";
import { APP_NAME } from "@/lib/constants";

import { Header } from "./header";

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
         <Header authenticated={authenticated} />

         <main className="flex-1">{children}</main>

         <footer className="border-t bg-muted/40 py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
               <div className="flex flex-col gap-16 sm:flex-row">
                  <div className="flex max-w-3xl flex-1 flex-col gap-5">
                     <Link
                        href="/"
                        className="text-lg whitespace-nowrap sm:text-xl"
                     >
                        {APP_NAME}
                     </Link>
                     <p className="text-muted-foreground">
                        Große Prompt-Bibliothek. Individuelle Anpassung. Leichte
                        Erstellung. Vision Notes revolutioniert deinen gesamten
                        Prompt-Workflow.
                     </p>
                  </div>
                  <div className="flex gap-16">
                     <div className="flex flex-col gap-4">
                        <p className="text-muted-foreground">Unternehmen</p>
                        <nav className="flex flex-col gap-3">
                           <Link
                              href="http://www.vision-notes.com/blog"
                              className="hover:underline"
                           >
                              Blog
                           </Link>
                        </nav>
                     </div>
                     <div className="flex flex-col gap-4">
                        <p className="text-muted-foreground">Rechtliches</p>
                        <nav className="flex flex-col gap-3">
                           <Link
                              href="http://www.vision-notes.com/legal/agb"
                              className="hover:underline"
                           >
                              AGB
                           </Link>
                           <Link
                              href="http://www.vision-notes.com/legal/privacypolicy"
                              className="hover:underline"
                           >
                              Datenschutz
                           </Link>
                           <Link
                              href="http://www.vision-notes.com/legal/cookies"
                              className="hover:underline"
                           >
                              Cookies
                           </Link>
                           <Link
                              href="http://www.vision-notes.com/legal/impressum"
                              className="hover:underline"
                           >
                              Impressum
                           </Link>
                        </nav>
                     </div>
                  </div>
               </div>
               <div className="mt-10">
                  <p className="text-sm text-muted-foreground">
                     © {new Date().getFullYear()} {APP_NAME}
                  </p>
               </div>
            </div>
         </footer>
      </div>
   );
};

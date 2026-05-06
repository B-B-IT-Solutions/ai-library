import { ReactNode } from "react";
import { Compass } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { isAuthenticated } from "@/data/actions/auth-utils";
import { APP_NAME } from "@/lib/constants";

type Props = {
   children: ReactNode;
};

export const ExploreLayout = async ({ children }: Props) => {
   const authenticated = await isAuthenticated();

   const headerBtns = () => {
      if (authenticated) {
         return (
            <Button asChild size="sm" variant="outline">
               <Link href="/">Zur Library</Link>
            </Button>
         );
      }
      return (
         <>
            <Button asChild size="sm" variant="ghost">
               <Link href="/auth/sign-in">Anmelden</Link>
            </Button>
            <Button asChild size="sm">
               <Link href="/auth/sign-up">Kostenlos starten</Link>
            </Button>
         </>
      );
   };

   return (
      <div
         className="flex min-h-screen flex-col bg-slate-50"
         data-testid="explore-layout"
      >
         {/* Nav */}
         <header className="sticky top-0 z-40 border-b bg-white shadow-sm">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
               <Link
                  href="/explore"
                  className="flex items-center gap-2 font-semibold text-slate-900"
               >
                  <Compass className="h-5 w-5 text-primary" />
                  <span className="hidden sm:inline">{APP_NAME} · </span>
                  Entdecken
               </Link>

               <div className="flex items-center gap-2">
                  {authenticated ? (
                     <Button asChild size="sm" variant="outline">
                        <Link href="/">Zur Library</Link>
                     </Button>
                  ) : (
                     <>
                        <Button asChild size="sm" variant="ghost">
                           <Link href="/auth/sign-in">Anmelden</Link>
                        </Button>
                        <Button asChild size="sm">
                           <Link href="/auth/sign-up">Kostenlos starten</Link>
                        </Button>
                     </>
                  )}
               </div>
            </div>
         </header>

         <main className="flex-1">{children}</main>

         <footer className="border-t bg-white py-6">
            <div className="mx-auto max-w-7xl px-4 text-center text-xs text-slate-400 sm:px-6">
               © {new Date().getFullYear()} {APP_NAME} · Alle Rechte vorbehalten
            </div>
         </footer>
      </div>
   );
};

export default ExploreLayout;

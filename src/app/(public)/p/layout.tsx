import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { APP_NAME } from "@/lib/constants";

export type PublicLayoutProps = {
   children: React.ReactNode;
};

const PublicLayout = async (props: Readonly<PublicLayoutProps>) => {
   const { children } = props;

   return (
      <div className="flex min-h-screen flex-col" data-testid="public-layout">
         <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto px-4 py-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-8">
                     <Link href="/p" className="flex items-center gap-3">
                        <span className="text-xl font-bold">{APP_NAME}</span>
                     </Link>
                     <nav className="hidden items-center gap-6 md:flex">
                        <Link
                           href="/p/marketplace"
                           className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                           Bibliothek
                        </Link>
                     </nav>
                  </div>
                  <div className="flex gap-3">
                     <Button variant="outline" asChild>
                        <Link href="/auth/sign-in" data-testid="sign-in-link">
                           Anmelden
                        </Link>
                     </Button>
                     <Button asChild>
                        <Link href="/auth/sign-up" data-testid="sign-up-link">
                           Kostenlos starten
                        </Link>
                     </Button>
                  </div>
               </div>
            </div>
         </header>

         <main className="flex-1">{children}</main>

         <footer className="border-t bg-muted/40 py-8">
            <div className="container mx-auto px-4">
               <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                  <Link
                     href="/p"
                     className="flex items-center gap-2 transition-opacity hover:opacity-80"
                  >
                     <span className="text-sm font-semibold">{APP_NAME}</span>
                  </Link>
                  <nav className="flex gap-6">
                     <Link
                        href="/p/marketplace"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                     >
                        Bibliothek
                     </Link>
                  </nav>
                  <p className="text-sm text-muted-foreground">
                     © {new Date().getFullYear()} {APP_NAME}
                  </p>
               </div>
            </div>
         </footer>
      </div>
   );
};

export default PublicLayout;

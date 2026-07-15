import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { getProdLandingPageUrl } from "@/lib/constants";

type Props = {
   authenticated: boolean;
};

export const DesktopNav = ({ authenticated }: Props) => {
   const landingPageUrl = getProdLandingPageUrl();

   if (authenticated) {
      return (
         <div
            className="hidden items-center justify-end gap-6 sm:flex"
            data-testid="desktop-nav"
         >
            <Button asChild={true} data-testid="to-library-link">
               <Link href="/">Zur Bibliothek</Link>
            </Button>
         </div>
      );
   }

   return (
      <div
         className="hidden items-center justify-between gap-6 sm:flex"
         data-testid="desktop-nav"
      >
         <nav className="flex items-center gap-1" data-testid="navigation">
            <Link
               href="/explore"
               className="rounded-md px-3 py-2 font-medium text-foreground/75 transition-colors hover:bg-accent hover:text-foreground"
               data-testid="explore-nav-item"
            >
               Entdecken
            </Link>
            <Link
               href={`${landingPageUrl}/pricing`}
               className="rounded-md px-3 py-2 font-medium text-foreground/75 transition-colors hover:bg-accent hover:text-foreground"
               data-testid="pricing-nav-item"
            >
               Preise
            </Link>
            <Link
               href={`${landingPageUrl}/blog`}
               className="rounded-md px-3 py-2 font-medium text-foreground/75 transition-colors hover:bg-accent hover:text-foreground"
               data-testid="blog-nav-item"
            >
               Blog
            </Link>
         </nav>
         <div className="flex items-center gap-3">
            <>
               <Button asChild={true} variant="outline">
                  <Link href="/auth/sign-in" data-testid="sign-in-link">
                     Anmelden
                  </Link>
               </Button>
               <Button asChild={true}>
                  <Link href="/auth/sign-up" data-testid="sign-up-link">
                     Kostenlos starten
                  </Link>
               </Button>
            </>
         </div>
      </div>
   );
};

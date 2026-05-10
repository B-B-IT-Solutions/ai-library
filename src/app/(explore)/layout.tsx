import { Compass } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { PublicShellLayout } from "@/components/shared/wrappers/public-shell-layout";
import { isAuthenticated } from "@/data/actions/auth-utils";
import { APP_NAME } from "@/lib/constants";

type Props = {
   children: React.ReactNode;
};

export const ExploreLayout = async ({ children }: Props) => {
   const authenticated = await isAuthenticated();

   const headerLeft = (
      <Link
         href="/explore"
         className="flex items-center gap-2 font-semibold"
         data-testid="explore-layout"
      >
         <Compass className="h-5 w-5 text-primary" />
         <span className="hidden sm:inline">{APP_NAME} · </span>
         Entdecken
      </Link>
   );

   const headerRight = authenticated ? (
      <Button asChild size="sm" variant="outline" data-testid="templates-link">
         <Link href="/">Zur Bibliothek</Link>
      </Button>
   ) : (
      <>
         <Button asChild size="sm" variant="ghost">
            <Link href="/auth/sign-in" data-testid="sign-in-link">
               Anmelden
            </Link>
         </Button>
         <Button asChild size="sm">
            <Link href="/auth/sign-up" data-testid="sign-up-link">
               Kostenlos starten
            </Link>
         </Button>
      </>
   );

   const footer = (
      <p className="text-center text-xs text-muted-foreground">
         © {new Date().getFullYear()} {APP_NAME} · Alle Rechte vorbehalten
      </p>
   );

   return (
      <PublicShellLayout
         headerLeft={headerLeft}
         headerRight={headerRight}
         footer={footer}
      >
         {children}
      </PublicShellLayout>
   );
};

export default ExploreLayout;

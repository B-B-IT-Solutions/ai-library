import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { PublicShellLayout } from "@/components/shared/wrappers/public-shell-layout";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

const RootPage = async () => {
   const headerLeft = (
      <Link href="/" className="text-xl font-bold">
         {APP_NAME}
      </Link>
   );

   const headerRight = (
      <>
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
      </>
   );

   const footer = (
      <p className="text-center text-sm text-muted-foreground">
         © {new Date().getFullYear()} {APP_NAME}
      </p>
   );

   return (
      <PublicShellLayout
         headerLeft={headerLeft}
         headerRight={headerRight}
         footer={footer}
      >
         <div
            className="min-h-[calc(100vh-3.5rem)] w-full bg-linear-to-br from-background via-background to-primary/5"
            data-testid="public-page"
         >
            <div className="container mx-auto px-4 py-16 md:py-24">
               <div className="mx-auto max-w-6xl">
                  <div className="mb-20 space-y-8 text-center">
                     <div className="space-y-4">
                        <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
                           Willkommen bei {APP_NAME}
                        </h1>
                        <p className="mx-auto max-w-3xl text-xl text-muted-foreground md:text-2xl">
                           {APP_DESCRIPTION}
                        </p>
                     </div>
                     <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" asChild>
                           <Link href="/auth/sign-up">Kostenlos starten</Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                           <Link href="/preview/marketplace">
                              Prompts entdecken
                           </Link>
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </PublicShellLayout>
   );
};

export default RootPage;

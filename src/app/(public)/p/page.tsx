import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

const PublicPage = async () => {
   return (
      <div
         className="min-h-screen w-full bg-linear-to-br from-background via-background to-primary/5"
         data-testid="public-page"
      >
         {/* Hero Section */}
         <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="mx-auto max-w-6xl">
               {/* Hero Content */}
               <div className="mb-20 space-y-8 text-center">
                  <div className="space-y-4">
                     <h2 className="text-5xl font-bold tracking-tight md:text-6xl">
                        Willkommen bei {APP_NAME}
                     </h2>
                     <p className="mx-auto max-w-3xl text-xl text-muted-foreground md:text-2xl">
                        {APP_DESCRIPTION}
                     </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4">
                     <Button size="lg" asChild>
                        <Link href="/auth/sign-up">Kostenlos starten</Link>
                     </Button>
                     <Button size="lg" variant="outline" asChild>
                        <Link href="/p/marketplace">Prompts entdecken</Link>
                     </Button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default PublicPage;

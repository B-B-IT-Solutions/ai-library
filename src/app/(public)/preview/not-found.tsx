import Link from "next/link";

import { Button } from "@/components/shadcn/button";

export const PreviewNotFound = () => {
   return (
      <div
         className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center"
         data-testid="preview-not-found"
      >
         <p className="text-6xl font-bold text-muted-foreground">404</p>
         <h1 className="text-2xl font-semibold">Seite nicht gefunden</h1>
         <p className="max-w-md text-sm text-muted-foreground">
            Die angeforderte Seite konnte nicht gefunden werden.
         </p>
         <Button asChild={true} variant="outline">
            <Link href="/preview/marketplace" data-testid="home-link">
               Zur Bibliothek
            </Link>
         </Button>
      </div>
   );
};

export default PreviewNotFound;

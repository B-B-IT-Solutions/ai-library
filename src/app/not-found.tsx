import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { APP_NAME } from "@/lib/constants";

const NotFoundPage = () => {
   return (
      <div
         className="flex flex-col items-center justify-center min-h-screen"
         data-testid="not-found-page"
      >
         <Image
            src="/images/logo.svg"
            width={48}
            height={48}
            alt={`${APP_NAME} logo`}
            priority={true}
         />
         <div className="p-6 w-1/3 rounded-lg shadow-md text-center">
            <h1 className="text-3xl font-bold mb-4">Nicht gefunden</h1>
            <p className="text-destructive">Die angeforderte Seite konnte nicht gefunden werden</p>
            <Button variant="outline" className="mt-4 ml-2" asChild>
               <Link href="/">Zurück zur Startseite</Link>
            </Button>
         </div>
      </div>
   );
};

export default NotFoundPage;

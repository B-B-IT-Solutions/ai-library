import { FC } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";

export const ReturnToLibraryButton: FC = () => {
   return (
      <Button
         asChild={true}
         variant="ghost"
         size="sm"
         className="cursor-pointer"
         data-testid="return-to-library-btn"
      >
         <Link href="/library">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur Bibliothek
         </Link>
      </Button>
   );
};

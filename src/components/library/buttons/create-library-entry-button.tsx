import { FC } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";

export const CreateLibraryEntryButton: FC = () => {
   return (
      <Link href="/library/new">
         <Button
            className="cursor-pointer"
            data-testid="create-library-entry-btn"
         >
            <Plus className="mr-2 h-4 w-4" />
            Neue Vorlage erstellen
         </Button>
      </Link>
   );
};

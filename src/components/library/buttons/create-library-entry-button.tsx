import { FC } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";

export const CreateLibraryEntryButton: FC = () => {
   return (
      <Button
         asChild={true}
         className="cursor-pointer"
         data-testid="create-library-entry-btn"
      >
         <Link href="/library/new">
            <Plus className="mr-1 h-4 w-4" />
            Neue Vorlage erstellen
         </Link>
      </Button>
   );
};

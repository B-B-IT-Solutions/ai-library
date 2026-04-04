import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";

export const CreateCollectionButton = () => {
   return (
      <Button
         asChild={true}
         className="cursor-pointer gap-2"
         data-testid="create-collection-btn"
      >
         <Link href="/collections/new">
            <Plus className="h-4 w-4" />
            Neue Vorlage
         </Link>
      </Button>
   );
};

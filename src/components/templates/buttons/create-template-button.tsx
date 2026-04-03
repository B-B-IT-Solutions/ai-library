import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";

export const CreateTemplateButton = () => {
   return (
      <Button
         asChild={true}
         size="sm"
         className="cursor-pointer gap-2"
         data-testid="create-template-btn"
      >
         <Link href="/templates/new">
            <Plus className="h-4 w-4" />
            Neue Vorlage
         </Link>
      </Button>
   );
};

import { FC } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/shadcn/button";

export const CreateTemplateButton: FC = () => {
   return (
      <Link href="/library/new">
         <Button data-testid="create-template-button">
            <Plus className="w-4 h-4 mr-2" />
            Neue Vorlage erstellen
         </Button>
      </Link>
   );
};

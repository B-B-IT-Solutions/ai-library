import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";

type Props = {
   size?: "default" | "sm";
};

export const CreateTemplateButton = ({ size = "default" }: Props) => {
   return (
      <Button
         asChild={true}
         size={size}
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

import { Edit2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";

type Props = {
   descriptor: DPromptTemplateDescriptor;
};

export const EditTemplateButton = ({ descriptor }: Props) => {
   return (
      <Button
         asChild={true}
         variant="outline"
         size="sm"
         data-testid="edit-template-btn"
      >
         <Link href={`/templates/${descriptor.id}/edit`}>
            <Edit2 className="h-4 w-4" />
            Bearbeiten
         </Link>
      </Button>
   );
};

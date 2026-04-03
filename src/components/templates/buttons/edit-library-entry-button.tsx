import { Edit2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { DPromptTemplateDescriptorWithTemplate } from "@/data/types/domain/prompt.template";

type Props = {
   descriptor: DPromptTemplateDescriptorWithTemplate;
};

export const EditLibraryEntryButton = ({ descriptor }: Props) => {
   return (
      <Button
         asChild={true}
         variant="outline"
         size="sm"
         data-testid="edit-entry-btn"
      >
         <Link href={`/templates/${descriptor.id}/edit`}>
            <Edit2 className="h-4 w-4" />
            Bearbeiten
         </Link>
      </Button>
   );
};

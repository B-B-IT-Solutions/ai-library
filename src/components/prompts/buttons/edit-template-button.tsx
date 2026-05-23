import { Edit2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { DPrompt } from "@/data/types/domain/prompt";

type Props = {
   descriptor: DPrompt;
   className?: string;
};

export const EditTemplateButton = ({ descriptor, className }: Props) => {
   return (
      <Button
         asChild={true}
         variant="outline"
         className={className}
         data-testid="edit-template-btn"
      >
         <Link href={`/templates/${descriptor.id}/edit`}>
            <Edit2 className="mr-2 h-4 w-4" />
            Bearbeiten
         </Link>
      </Button>
   );
};

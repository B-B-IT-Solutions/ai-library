import { Edit2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { DPrompt } from "@/data/types/domain/prompt";

type Props = {
   prompt: DPrompt;
};

export const EditButton = ({ prompt }: Props) => {
   return (
      <Button
         asChild={true}
         variant="outline"
         className="w-full cursor-pointer justify-start"
         data-testid="edit-prompt-btn"
      >
         <Link href={`/templates/${prompt.id}/edit`}>
            <Edit2 className="mr-2 h-4 w-4" />
            Bearbeiten
         </Link>
      </Button>
   );
};

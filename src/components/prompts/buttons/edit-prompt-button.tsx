import { Edit2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { DCollection } from "@/data/types/domain/collection";
import { DPrompt } from "@/data/types/domain/prompt";
import { editPromptUrl } from "../utils";

type Props = {
   prompt: DPrompt;
   collection?: DCollection | null;
};

export const EditButton = ({ prompt, collection }: Props) => {
   const href = editPromptUrl(prompt, collection);

   return (
      <Button
         asChild={true}
         variant="outline"
         className="w-full cursor-pointer justify-start"
         data-testid="edit-prompt-btn"
      >
         <Link href={href}>
            <Edit2 className="mr-2 h-4 w-4" />
            Bearbeiten
         </Link>
      </Button>
   );
};

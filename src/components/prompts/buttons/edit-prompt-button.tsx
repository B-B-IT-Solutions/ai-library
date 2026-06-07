import { Edit2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { DropdownMenuItem } from "@/components/shadcn/dropdown-menu";
import { DCollectionPreview } from "@/data/types/domain/collection";
import { DPrompt } from "@/data/types/domain/prompt";
import { editPromptUrl } from "../utils";

type Props = {
   prompt: DPrompt;
   currentCollection?: DCollectionPreview;
   asMenuItem?: boolean;
};

export const EditPromptButton = ({
   prompt,
   currentCollection,
   asMenuItem,
}: Props) => {
   const href = editPromptUrl(prompt, currentCollection);

   const label = () => {
      return (
         <>
            <Edit2 className="mr-2 h-4 w-4" />
            Bearbeiten
         </>
      );
   };

   if (asMenuItem) {
      return (
         <DropdownMenuItem
            asChild={true}
            className="cursor-pointer hover:bg-accent"
            data-testid="edit-prompt-menu-item"
         >
            <Link href={href}>{label()}</Link>
         </DropdownMenuItem>
      );
   }

   return (
      <Button
         asChild={true}
         variant="outline"
         className="w-full cursor-pointer justify-start"
         data-testid="edit-prompt-btn"
      >
         <Link href={href}>{label()}</Link>
      </Button>
   );
};

import { Eye } from "lucide-react";
import Link from "next/link";

import { DropdownMenuItem } from "@/components/shadcn/dropdown-menu";
import { DCollection } from "@/data/types/domain/collection";
import { DPrompt } from "@/data/types/domain/prompt";
import { viewPromptUrl } from "../utils";

type Props = {
   prompt: DPrompt;
   collection?: DCollection;
};

export const ViewPromptButton = ({ prompt, collection }: Props) => {
   const href = viewPromptUrl(prompt, collection?.id);

   return (
      <DropdownMenuItem
         asChild={true}
         className="cursor-pointer hover:bg-accent"
         data-testid="view-prompt-menu-item"
      >
         <Link href={href}>
            <Eye className="mr-2 h-4 w-4" />
            Ansehen
         </Link>
      </DropdownMenuItem>
   );
};

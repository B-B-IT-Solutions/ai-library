import { FC } from "react";
import { Edit2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { DPromptDescriptor } from "@/data/types/domain/prompt";

type EditPromptButtonProps = {
   prompt: DPromptDescriptor;
};

export const EditPromptButton: FC<EditPromptButtonProps> = ({ prompt }) => {
   return (
      <Tooltip>
         <TooltipTrigger asChild={true}>
            <Button asChild={true} size="sm" data-testid="edit-prompt-btn">
               <Link href={`/prompts/${prompt.id}/edit`}>
                  <Edit2 className="size-4" />
                  Bearbeiten
               </Link>
            </Button>
         </TooltipTrigger>
         <TooltipContent>Prompt bearbeiten</TooltipContent>
      </Tooltip>
   );
};

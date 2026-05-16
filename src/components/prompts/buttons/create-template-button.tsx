import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from "@/components/shadcn/tooltip";

type Props = {
   size?: "default" | "sm";
   atLimit?: boolean;
};

export const CreateTemplateButton = ({
   size = "default",
   atLimit = false,
}: Props) => {
   if (atLimit) {
      return (
         <Tooltip>
            <TooltipTrigger asChild>
               <span>
                  <Button
                     size={size}
                     disabled
                     className="cursor-not-allowed gap-2"
                     data-testid="create-template-btn"
                  >
                     <Plus className="h-4 w-4" />
                     Neue Vorlage
                  </Button>
               </span>
            </TooltipTrigger>
            <TooltipContent data-testid="create-template-btn-tooltip">
               Limit erreicht. Upgrade deinen Plan für mehr Vorlagen.
            </TooltipContent>
         </Tooltip>
      );
   }

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

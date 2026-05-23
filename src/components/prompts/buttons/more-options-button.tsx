"use client";

import { MoreVertical } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { DPrompt } from "@/data/types/domain/prompt";

import { DeletePromptButton } from "./delete-prompt-button";
import { DownloadPromptButton } from "./download-prompt-button";

type Props = {
   descriptor: DPrompt;
};

export const MoreOptionsButton = ({ descriptor }: Props) => {
   return (
      <DropdownMenu data-testid="more-options-btn">
         <DropdownMenuTrigger asChild={true}>
            <Button
               variant="outline"
               size="icon-sm"
               className="cursor-pointer"
               data-testid="more-options-trigger-btn"
            >
               <MoreVertical className="h-4 w-4" />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end">
            <DownloadPromptButton prompt={descriptor} asMenuItem={true} />
            <DeletePromptButton prompt={descriptor} asMenuItem={true} />
         </DropdownMenuContent>
      </DropdownMenu>
   );
};

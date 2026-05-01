"use client";

import { MoreVertical } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";

import { DeleteTemplateButton } from "./delete-template-button";
import { DownloadTemplateButton } from "./download-template-button";

type Props = {
   descriptor: DPromptTemplateDescriptor;
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
            <DownloadTemplateButton descriptor={descriptor} asMenuItem={true} />
            <DeleteTemplateButton descriptor={descriptor} />
         </DropdownMenuContent>
      </DropdownMenu>
   );
};

"use client";

import { FC } from "react";
import { MoreVertical } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { DPromptDescriptor } from "@/data/types/domain/prompt";

import { DeletePromptButton } from "./delete-prompt-button";

type Props = {
   prompt: DPromptDescriptor;
};

export const MoreOptionsButton: FC<Props> = ({ prompt }) => {
   return (
      <DropdownMenu data-testid="more-options-btn">
         <DropdownMenuTrigger asChild={true}>
            <Button
               variant="outline"
               size="icon-sm"
               className="cursor-pointer"
               data-testid="more-options-trigger-btn"
            >
               <MoreVertical className="size-4" />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end">
            <DeletePromptButton prompt={prompt} />
         </DropdownMenuContent>
      </DropdownMenu>
   );
};

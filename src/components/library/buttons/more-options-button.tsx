"use client";

import { FC } from "react";
import { MoreVertical } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { DLibraryEntry } from "@/data/types/domain/library";

import { DeleteLibraryEntryButton } from "./delete-library-entry-button";
import { DownloadTemplateButton } from "./download-template-button";

type Props = {
   entry: DLibraryEntry;
};

export const MoreOptionsButton: FC<Props> = ({ entry }) => {
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
            <DownloadTemplateButton
               descriptor={entry.templateDescriptor}
               asMenuItem={true}
            />
            <DeleteLibraryEntryButton entry={entry} />
         </DropdownMenuContent>
      </DropdownMenu>
   );
};

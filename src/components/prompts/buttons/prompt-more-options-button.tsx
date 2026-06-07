"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";

import { AddToCollectionDialog } from "@/components/collections";
import { Button } from "@/components/shadcn/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { DCollectionPreview } from "@/data/types/domain/collection";
import { DPrompt } from "@/data/types/domain/prompt";

import { AddPromptToCollectionButton } from "./add-prompt-to-collection-button";
import { DeletePromptButton } from "./delete-prompt-button";
import { DownloadPromptButton } from "./download-prompt-button";
import { EditPromptButton } from "./edit-prompt-button";
import { ViewPromptButton } from "./view-prompt-button";

type Props = {
   prompt: DPrompt;
   collections: DCollectionPreview[];
   currentCollection?: DCollectionPreview;
};

export const PromptMoreOptionsButton = ({
   prompt,
   collections,
   currentCollection,
}: Props) => {
   const [showAddToCollectionDialog, setShowAddToCollectionDialog] =
      useState(false);

   return (
      <>
         <DropdownMenu data-testid="prompt-more-options-btn">
            <DropdownMenuTrigger asChild={true}>
               <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  data-testid="more-options-trigger-btn"
               >
                  <MoreVertical className="h-4 w-4" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
               <ViewPromptButton
                  prompt={prompt}
                  currentCollection={currentCollection}
               />
               <EditPromptButton
                  prompt={prompt}
                  currentCollection={currentCollection}
                  asMenuItem={true}
               />
               <AddPromptToCollectionButton
                  onClick={() => setShowAddToCollectionDialog(true)}
               />
               <DownloadPromptButton prompt={prompt} asMenuItem={true} />
               <DropdownMenuSeparator />
               <DeletePromptButton prompt={prompt} asMenuItem={true} />
            </DropdownMenuContent>
         </DropdownMenu>
         <AddToCollectionDialog
            prompt={prompt}
            collections={collections}
            open={showAddToCollectionDialog}
            onOpenChange={setShowAddToCollectionDialog}
         />
      </>
   );
};

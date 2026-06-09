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
   currentCollection?: DCollectionPreview;
};

export const PromptMoreOptionsButton = ({
   prompt,
   currentCollection,
}: Props) => {
   const [showAddToCollectionDialog, setShowAddToCollectionDialog] =
      useState(false);

   const [isMenuOpen, setIsMenuOpen] = useState(false);

   const handleContextMenuOpen = (open: boolean) => {
      if (open) {
         setIsMenuOpen(true);
      } else {
         console.log("data");
         setTimeout(() => setIsMenuOpen(false), 200);
      }
   };

   return (
      <>
         <DropdownMenu
            data-testid="prompt-more-options-btn"
            onOpenChange={handleContextMenuOpen}
         >
            <DropdownMenuTrigger asChild={true}>
               <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  aria-label="Weitere Optionen"
                  title="Weitere Optionen"
                  data-state={isMenuOpen && "open"}
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
            open={showAddToCollectionDialog}
            onOpenChange={setShowAddToCollectionDialog}
         />
      </>
   );
};

"use client";

import { useState } from "react";
import { Wand2 } from "lucide-react";

import { UsePromptDialog } from "@/components/prompt-templating";
import { Button } from "@/components/shadcn/button";
import { DCatalogEntryWithContent } from "@/data/types/domain/catalog";

import { toDPrompt, toDPromptGenerationData } from "./use-entry.utils";

type Props = {
   entry: DCatalogEntryWithContent;
};

export const UseCatalogEntryButton = ({ entry }: Props) => {
   const [isOpen, setIsOpen] = useState(false);

   const dialog = () => {
      if (isOpen) {
         return (
            <UsePromptDialog
               prompt={toDPrompt(entry)}
               generationData={toDPromptGenerationData(entry)}
               onCancel={() => setIsOpen(false)}
            />
         );
      }
   };

   return (
      <>
         <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="w-full cursor-pointer sm:w-auto"
            data-testid="use-entry-btn"
         >
            <Wand2 className="mr-2 h-4 w-4" />
            Prompt anwenden
         </Button>
         {dialog()}
      </>
   );
};

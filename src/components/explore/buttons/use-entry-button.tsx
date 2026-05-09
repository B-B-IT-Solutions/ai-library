"use client";

import { useState } from "react";
import { Wand2 } from "lucide-react";

import { UseTemplateDialog } from "@/components/prompt-templates";
import { Button } from "@/components/shadcn/button";
import { DCatalogEntryWithContent } from "@/data/types/domain/catalog";

import {
   toCatalogEntryDescriptor,
   toCatalogEntryTemplateData,
} from "./use-entry.utils";

type Props = {
   entry: DCatalogEntryWithContent;
};

export const UseEntryButton = ({ entry }: Props) => {
   const [isOpen, setIsOpen] = useState(false);

   const dialog = () => {
      if (isOpen) {
         return (
            <UseTemplateDialog
               descriptor={toCatalogEntryDescriptor(entry)}
               templateData={toCatalogEntryTemplateData(entry)}
               onCancel={() => setIsOpen(false)}
            />
         );
      }
   };

   return (
      <>
         <Button
            onClick={() => setIsOpen(true)}
            variant="outline"
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

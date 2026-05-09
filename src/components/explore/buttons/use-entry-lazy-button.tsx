"use client";

import { useState, useTransition } from "react";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { UseTemplateDialog } from "@/components/prompt-templates";
import { Button } from "@/components/shadcn/button";
import { getPublishedCatalogEntryBySlug } from "@/data/actions/catalog";
import { DCatalogEntryWithContent } from "@/data/types/domain/catalog";

import {
   toCatalogEntryDescriptor,
   toCatalogEntryTemplateData,
} from "./use-entry.utils";

type Props = {
   slug: string;
};

export const UseEntryLazyButton = ({ slug }: Props) => {
   const [isPending, startTransition] = useTransition();
   const [entry, setEntry] = useState<DCatalogEntryWithContent | null>(null);
   const [isOpen, setIsOpen] = useState(false);

   const handleClick = async () => {
      startTransition(async () => {
         const data = await getPublishedCatalogEntryBySlug(slug);
         if (data) {
            setEntry(data);
            setIsOpen(true);
         } else {
            toast.error("Vorlage konnte nicht geladen werden");
         }
      });
   };

   const dialog = () => {
      if (isOpen && entry) {
         return (
            <UseTemplateDialog
               descriptor={toCatalogEntryDescriptor(entry)}
               templateData={toCatalogEntryTemplateData(entry)}
               onCancel={() => {
                  setIsOpen(false);
                  setEntry(null);
               }}
            />
         );
      }
   };

   return (
      <>
         <Button
            onClick={handleClick}
            disabled={isPending}
            variant="default"
            size="sm"
            className="flex-1 cursor-pointer"
            data-testid="use-entry-lazy-btn"
         >
            {isPending ? (
               <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
               <Wand2 className="mr-1.5 h-3.5 w-3.5" />
            )}
            Anwenden
         </Button>
         {dialog()}
      </>
   );
};

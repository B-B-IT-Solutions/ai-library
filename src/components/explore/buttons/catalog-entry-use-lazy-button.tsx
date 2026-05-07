"use client";

import { useState } from "react";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { UseTemplateDialog } from "@/components/prompt-templates";
import { Button } from "@/components/shadcn/button";
import { getPublishedCatalogEntryBySlug } from "@/data/actions/catalog";
import { DCatalogEntryWithContent } from "@/data/types/domain/catalog";

import {
   toCatalogEntryDescriptor,
   toCatalogEntryTemplateData,
} from "./catalog-entry-use.utils";

type Props = {
   slug: string;
   recommendedModel?: string;
};

export const CatalogEntryUseLazyButton = ({ slug }: Props) => {
   const [isLoading, setIsLoading] = useState(false);
   const [entry, setEntry] = useState<DCatalogEntryWithContent | null>(null);
   const [isOpen, setIsOpen] = useState(false);

   const handleClick = async () => {
      setIsLoading(true);
      const data = await getPublishedCatalogEntryBySlug(slug);
      setIsLoading(false);

      if (data) {
         setEntry(data);
         setIsOpen(true);
      } else {
         toast.error("Vorlage konnte nicht geladen werden");
      }
   };

   return (
      <>
         <Button
            onClick={handleClick}
            disabled={isLoading}
            variant="default"
            size="sm"
            className="flex-1"
            data-testid="catalog-entry-use-lazy-btn"
         >
            {isLoading ? (
               <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
               <Wand2 className="mr-1.5 h-3.5 w-3.5" />
            )}
            Anwenden
         </Button>

         {isOpen && entry && (
            <UseTemplateDialog
               descriptor={toCatalogEntryDescriptor(entry)}
               templateData={toCatalogEntryTemplateData(entry)}
               onCancel={() => {
                  setIsOpen(false);
                  setEntry(null);
               }}
            />
         )}
      </>
   );
};

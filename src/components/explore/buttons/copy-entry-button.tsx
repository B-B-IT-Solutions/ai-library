"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { AuthRequiredDialog } from "@/components/shared/auth";
import { copyCatalogEntryToUserTemplates } from "@/data/actions/catalog";
import { DCatalogEntry } from "@/data/types/domain/catalog";

type Props = {
   entry: DCatalogEntry;
   isAuthenticated: boolean;
};

export const CopyCatalogEntryButton = ({ entry, isAuthenticated }: Props) => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();
   const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

   const copyEntry = () => {
      startTransition(async () => {
         const result = await copyCatalogEntryToUserTemplates(entry.id);

         if (result.success) {
            toast.success("Vorlage wurde in deine Library übernommen", {
               action: {
                  label: "Jetzt anzeigen",
                  onClick: () => {
                     router.push(`/templates/${result.data!.templateId}`);
                  },
               },
               duration: 5000,
            });
         } else {
            toast.error("Vorlage konnte nicht übernommen werden");
         }
      });
   };

   const handleClick = () => {
      if (isAuthenticated) {
         copyEntry();
      } else {
         setIsAuthDialogOpen(true);
      }
   };

   return (
      <>
         <Button
            onClick={handleClick}
            disabled={isPending}
            variant="outline"
            size="lg"
            className="w-full cursor-pointer sm:w-auto"
            data-testid={
               isAuthenticated
                  ? "catalog-entry-copy-btn"
                  : "catalog-entry-register-btn"
            }
         >
            {isPending ? (
               <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird übernommen…
               </>
            ) : (
               <>
                  <Plus className="mr-2 h-4 w-4" />
                  In Bibliothek übernehmen
               </>
            )}
         </Button>
         <AuthRequiredDialog
            isOpen={isAuthDialogOpen}
            onOpenChange={setIsAuthDialogOpen}
            redirectPath={`/explore/${entry.slug}`}
            description="Bitte melde dich an, um Vorlagen in deine Bibliothek zu übernehmen."
         />
      </>
   );
};

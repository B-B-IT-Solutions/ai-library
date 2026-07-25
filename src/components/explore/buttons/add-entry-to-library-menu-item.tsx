"use client";

import { useTransition } from "react";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DropdownMenuItem } from "@/components/shadcn/dropdown-menu";
import { addCatalogEntryToUserPrompts } from "@/data/actions/catalog";
import { CallbackFn } from "@/data/types/common";
import { DCatalogEntry } from "@/data/types/domain/catalog";

type Props = {
   entry: DCatalogEntry;
   isAuthenticated: boolean;
   onAuthRequired: CallbackFn;
};

export const AddCatalogEntryToLibraryMenuItem = ({
   entry,
   isAuthenticated,
   onAuthRequired,
}: Props) => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();

   const addEntryToLibrary = () => {
      startTransition(async () => {
         const result = await addCatalogEntryToUserPrompts(entry.id);

         if (result.success) {
            toast.success("Vorlage wurde in deine Library übernommen", {
               action: {
                  label: "Jetzt anzeigen",
                  onClick: () => {
                     router.push(`/prompts/${result.data!.templateId}`);
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
         addEntryToLibrary();
      } else {
         onAuthRequired();
      }
   };

   return (
      <DropdownMenuItem
         onClick={handleClick}
         disabled={isPending}
         className="flex cursor-pointer items-center gap-2"
         data-testid="add-entry-to-library-menu-item"
      >
         {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
         ) : (
            <Plus className="h-4 w-4" />
         )}
         In Bibliothek übernehmen
      </DropdownMenuItem>
   );
};

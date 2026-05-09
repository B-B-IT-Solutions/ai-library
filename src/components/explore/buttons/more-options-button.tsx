"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { AuthRequiredDialog } from "@/components/shared/auth";
import { DCatalogEntry } from "@/data/types/domain/catalog";

import { AddCatalogEntryToLibraryMenuItem } from "./add-entry-to-library-menu-item";
import { ViewCatalogEntryMenuItem } from "./view-entry-menu-item";

type Props = {
   entry: DCatalogEntry;
   isAuthenticated: boolean;
};

export const CatalogEntryMoreOptionsButton = ({
   entry,
   isAuthenticated,
}: Props) => {
   const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

   return (
      <>
         <DropdownMenu data-testid="catalog-entry-more-options-btn">
            <DropdownMenuTrigger asChild={true}>
               <Button
                  variant="outline"
                  size="icon-sm"
                  className="cursor-pointer"
                  data-testid="trigger-btn"
               >
                  <MoreVertical className="h-4 w-4" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
               <ViewCatalogEntryMenuItem slug={entry.slug} />
               <AddCatalogEntryToLibraryMenuItem
                  entry={entry}
                  isAuthenticated={isAuthenticated}
                  onAuthRequired={() => setIsAuthDialogOpen(true)}
               />
            </DropdownMenuContent>
         </DropdownMenu>
         <AuthRequiredDialog
            isOpen={isAuthDialogOpen}
            onOpenChange={setIsAuthDialogOpen}
            redirectPath={`/explore/${entry.slug}`}
            description="Bitte melde dich an, um Vorlagen in deine Bibliothek zu übernehmen."
         />
      </>
   );
};

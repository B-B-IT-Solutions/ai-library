"use client";

import { MoreVertical } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { DCatalogEntry } from "@/data/types/domain/catalog";

import { ViewCatalogEntryMenuItem } from "./view-entry-menu-item";

type Props = {
   entry: DCatalogEntry;
};

export const CatalogEntryMoreOptionsButton = ({ entry }: Props) => {
   return (
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
         </DropdownMenuContent>
      </DropdownMenu>
   );
};

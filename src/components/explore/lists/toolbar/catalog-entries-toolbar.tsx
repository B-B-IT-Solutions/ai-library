"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { useQueryState } from "nuqs";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import {
   Sheet,
   SheetContent,
   SheetTitle,
   SheetTrigger,
} from "@/components/shadcn/sheet";
import { ListViewToggle } from "@/components/shared/buttons";
import { DCatalogEntryCategory } from "@/data/types/domain/catalog";
import { DListViewMode } from "@/data/types/domain/common";
import { f_categoriesParam } from "../../catalog-search-params";

import { SearchFilter } from "./filters";
import { CatalogEntryFilters } from "./filters/catalog-entry-filters";
import { CatalogSortBySelect } from "./sort-by";

type Props = {
   viewMode: DListViewMode;
   categories: DCatalogEntryCategory[];
};

export const CatalogEntriesToolbar = ({ viewMode, categories }: Props) => {
   const [sheetOpen, setSheetOpen] = useState(false);
   const [f_categories] = useQueryState("f_categories", f_categoriesParam);
   const activeFilterCount = f_categories.length;

   const filterSheet = () => {
      return (
         <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <div className="relative flex-1 sm:flex-none md:hidden">
               <SheetTrigger asChild>
                  <Button
                     variant="outline"
                     className="h-9 w-full gap-2 sm:h-8"
                     data-testid="mobile-filter-btn"
                  >
                     <Filter className="h-4 w-4" />
                     Filter
                  </Button>
               </SheetTrigger>
               {activeFilterCount > 0 && (
                  <Badge
                     variant="secondary"
                     className="pointer-events-none absolute -top-1 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full p-0 text-xs"
                     data-testid="filter-count-badge"
                  >
                     {activeFilterCount}
                  </Badge>
               )}
            </div>
            <SheetContent side="left" className="w-72 p-0">
               <SheetTitle className="sr-only">Filter</SheetTitle>
               <CatalogEntryFilters
                  categories={categories}
                  onSelect={() => setSheetOpen(false)}
               />
            </SheetContent>
         </Sheet>
      );
   };

   return (
      <div
         className="mb-4 border-b bg-white pb-3"
         data-testid="catalog-entries-toolbar"
      >
         {/* Mobile */}
         <div className="flex flex-col gap-2 sm:hidden">
            <SearchFilter />
            <div className="flex gap-2">
               {filterSheet()}
               <div className="flex-1">
                  <CatalogSortBySelect />
               </div>
            </div>
         </div>

         {/* Desktop */}
         <div className="hidden items-center justify-between sm:flex">
            <div className="flex items-center gap-3">
               <SearchFilter />
            </div>
            <div className="flex items-center gap-3">
               <CatalogSortBySelect />
               <ListViewToggle currentView={viewMode} />
            </div>
         </div>
      </div>
   );
};

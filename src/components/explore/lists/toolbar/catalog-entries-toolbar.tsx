"use client";

import { useState } from "react";
import { Filter } from "lucide-react";

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
import { CatalogEntryFilters } from "./filters/catalog-entry-filters";

import { SearchFilter } from "./filters";
import { CatalogSortBySelect } from "./sort-by";

type Props = {
   viewMode: DListViewMode;
   categories: DCatalogEntryCategory[];
   totalElements: number;
};

export const CatalogEntriesToolbar = ({
   viewMode,
   categories,
   totalElements,
}: Props) => {
   const [sheetOpen, setSheetOpen] = useState(false);

   const filterSheet = () => {
      return (
         <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
               <Button
                  variant="outline"
                  className="h-9 flex-1 gap-2 sm:h-8 sm:flex-none md:hidden"
                  data-testid="mobile-filter-btn"
               >
                  <Filter className="h-4 w-4" />
                  Filter
               </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
               <SheetTitle className="sr-only">Filter</SheetTitle>
               <CatalogEntryFilters
                  categories={categories}
                  totalElements={totalElements}
                  onSelect={() => setSheetOpen(false)}
               />
            </SheetContent>
         </Sheet>
      );
   };

   return (
      <div
         className="mb-4 rounded-xl border bg-white px-5 py-3 shadow-sm"
         data-testid="catalog-entries-toolbar"
      >
         {/* Mobile */}
         <div className="flex flex-col gap-2 sm:hidden">
            <SearchFilter />
            <div className="flex gap-2">
               {filterSheet()}
               <div>
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

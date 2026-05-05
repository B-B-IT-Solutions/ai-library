"use client";

import { useState } from "react";
import { Filter, Search } from "lucide-react";
import { useQueryState } from "nuqs";

import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import {
   Sheet,
   SheetContent,
   SheetTitle,
   SheetTrigger,
} from "@/components/shadcn/sheet";
import { ListViewToggle } from "@/components/shared/buttons";
import { DCatalogEntryCategory } from "@/data/types/domain/catalog";
import { DListViewMode } from "@/data/types/domain/common";
import { f_searchParam } from "../../catalog-search-params";
import { CatalogFilterContent } from "../sidebar/catalog-filter-content";
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
   const [q, setQ] = useQueryState(
      "f_search",
      f_searchParam.withOptions({ shallow: false })
   );

   return (
      <div
         className="mb-4 rounded-xl border bg-white px-5 py-3 shadow-sm"
         data-testid="catalog-entries-toolbar"
      >
         <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:justify-between">
            {/* Search — volle Breite auf Mobile (order 1), inline auf Desktop */}
            <div className="relative order-1 w-full sm:w-64">
               <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
               <Input
                  data-testid="explore-search-input"
                  placeholder="Suchen…"
                  value={q || ""}
                  onChange={(e) => setQ(e.target.value || null)}
                  className="h-9 w-full pl-9 sm:h-8"
               />
            </div>

            {/* Filter-Button — nur Mobile (< md), order 2 */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
               <SheetTrigger asChild>
                  <Button
                     variant="outline"
                     className="order-2 h-9 flex-1 gap-2 md:hidden"
                     data-testid="mobile-filter-btn"
                  >
                     <Filter className="h-4 w-4" />
                     Filter
                  </Button>
               </SheetTrigger>
               <SheetContent side="left" className="w-72 p-0">
                  <SheetTitle className="sr-only">Filter</SheetTitle>
                  <CatalogFilterContent
                     categories={categories}
                     totalElements={totalElements}
                     onSelect={() => setSheetOpen(false)}
                  />
               </SheetContent>
            </Sheet>

            {/* Sort — order 3 auf Mobile (halbe Breite), rechts auf Desktop */}
            <div className="order-3 flex-1 sm:flex-none">
               <CatalogSortBySelect />
            </div>

            {/* ViewToggle — nur Desktop */}
            <div className="order-4 hidden sm:block">
               <ListViewToggle currentView={viewMode} />
            </div>
         </div>
      </div>
   );
};

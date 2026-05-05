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

   const filterSheet = (
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
            <CatalogFilterContent
               categories={categories}
               totalElements={totalElements}
               onSelect={() => setSheetOpen(false)}
            />
         </SheetContent>
      </Sheet>
   );

   return (
      <div
         className="mb-4 rounded-xl border bg-white px-5 py-3 shadow-sm"
         data-testid="catalog-entries-toolbar"
      >
         {/* Mobile */}
         <div className="flex flex-col gap-2 sm:hidden">
            <div className="relative">
               <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
               <Input
                  data-testid="explore-search-input"
                  placeholder="Suchen…"
                  value={q || ""}
                  onChange={(e) => setQ(e.target.value || null)}
                  className="h-9 w-full pl-9"
               />
            </div>
            <div className="flex gap-2">
               {filterSheet}
               <div>
                  <CatalogSortBySelect />
               </div>
            </div>
         </div>

         {/* Desktop */}
         <div className="hidden items-center justify-between sm:flex">
            <div className="flex items-center gap-3">
               {filterSheet}
               <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                     placeholder="Suchen…"
                     value={q || ""}
                     onChange={(e) => setQ(e.target.value || null)}
                     className="h-8 w-64 pl-9 text-sm"
                  />
               </div>
            </div>
            <div className="flex items-center gap-3">
               <CatalogSortBySelect />
               <ListViewToggle currentView={viewMode} />
            </div>
         </div>
      </div>
   );
};

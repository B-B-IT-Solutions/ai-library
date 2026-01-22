"use client";

import { FC, useContext } from "react";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/shadcn/button";

import { FiltersContext } from "./context";
import { CategoriesFilter } from "./filter/categories-filter";
import { SearchFilter } from "./filter/search-filter";

export const PromptFilters: FC = () => {
   const filtersContext = useContext(FiltersContext);

   if (!filtersContext) {
      return null;
   }
   const { setFilters, hasActiveFilters } = filtersContext;

   const clearAllFilters = () => {
      setFilters({});
   };

   const filterHeader = () => {
      return (
         <div className="flex items-center justify-end pb-1">
            <Button
               variant="ghost"
               size="sm"
               disabled={!hasActiveFilters}
               onClick={clearAllFilters}
               className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
               data-testid="reset-btn"
            >
               <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
               <span className="text-xs font-medium">Zurücksetzen</span>
            </Button>
         </div>
      );
   };

   return (
      <div
         className="px-5 pt-1 pb-3 border-b border-slate-200/80 bg-white animate-in slide-in-from-top-4 duration-200"
         data-testid="prompts-filter"
      >
         {filterHeader()}
         <div className="flex flex-col gap-2">
            <SearchFilter />
            <CategoriesFilter />
         </div>
      </div>
   );
};

"use client";

import { FC, useContext, useState } from "react";
import { debounce } from "es-toolkit/compat";
import { RotateCcw, Search, X } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";

import { FiltersContext } from "./context";
import { CategoriesFilter } from "./filter/categories-filter";
import { SearchFilter } from "./filter/search-filter";

export type Filters = {
   search?: string;
   categories?: string[];
};

type PromptFiltersProps = {
   onFiltersUpdate: (filters: Filters) => void;
};

export const PromptFilters: FC<PromptFiltersProps> = ({ onFiltersUpdate }) => {
   const filtersContext = useContext(FiltersContext);

   console.log("PromptFilters", filtersContext?.filters);

   const [search, setSearch] = useState<string>("");
   const [categories, setCategories] = useState<string[]>([]);

   const onSearchUpdate = debounce((value: string) => {
      setSearch(value);
      onFiltersUpdate({ search: value, categories });
   }, 300);

   const clearAllFilters = () => {
      setSearch("");
      setCategories([]);
      onFiltersUpdate({ search: "", categories: [] });
      // Reset search input
      const searchInput = document.getElementById(
         "search-prompts"
      ) as HTMLInputElement;
      if (searchInput) searchInput.value = "";
   };

   const hasActiveFilters = search || categories.length > 0;

   const filterHeader = () => {
      return (
         <div className="flex items-center justify-end mb-4 pb-3 border-b border-slate-200">
            <Button
               variant="ghost"
               size="sm"
               disabled={!hasActiveFilters}
               onClick={clearAllFilters}
               className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
               <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
               <span className="text-xs font-medium">Zurücksetzen</span>
            </Button>
         </div>
      );
   };

   const searchInput = () => {
      return (
         <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
               Suchbegriff
            </label>
            <div className="relative" data-testid="search-input">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <Input
                  id="search-prompts"
                  type="text"
                  placeholder="Nach Titel suchen..."
                  onChange={(e) => onSearchUpdate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 focus:bg-white transition-all shadow-sm"
               />
            </div>
         </div>
      );
   };

   return (
      <div data-testid="prompts-filter">
         {filterHeader()}
         <div className="flex flex-col gap-2">
            <SearchFilter />
            <CategoriesFilter />
         </div>
      </div>
   );
};

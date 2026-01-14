"use client";

import { FC, useContext } from "react";
import { isUndefined } from "es-toolkit";
import { debounce } from "es-toolkit/compat";
import { Search } from "lucide-react";

import { Input } from "@/components/shadcn/input";
import { FiltersContext } from "../context";

export const SearchFilter: FC = () => {
   const filtersContext = useContext(FiltersContext);

   if (!filtersContext) {
      return null;
   }

   const { filters, setFilters } = filtersContext;
   const { search } = filters;

   if (isUndefined(search)) {
      const input = document.getElementById(
         "search-prompts"
      ) as HTMLInputElement | null;

      if (input) {
         input.value = "";
      }
   }

   const onSearchUpdate = debounce((value: string) => {
      setFilters({ ...filters, search: value });
   }, 300);

   return (
      <div className="space-y-2" data-testid="search-filter">
         <label
            className="text-sm font-semibold text-slate-700 uppercase tracking-wide"
            data-testid="filter-label"
         >
            Suchbegriff
         </label>
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
               id="search-prompts"
               type="text"
               placeholder="Nach Titel suchen..."
               defaultValue={search}
               onChange={(e) => onSearchUpdate(e.target.value)}
               className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 focus:bg-white transition-all shadow-sm"
               data-testid="search-input"
            />
         </div>
      </div>
   );
};

"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

import { Input } from "@/components/shadcn/input";

import { useLibraryEntryFiltersContext } from "./filters-context";

export const SearchFilter = () => {
   const filtersContext = useLibraryEntryFiltersContext();
   const [search, setSearch] = useState(filtersContext.getSearch());

   const updateFiltersContext = useDebouncedCallback((value: string) => {
      filtersContext.setSearch(value);
   }, 300);

   const handleChange = (value: string) => {
      setSearch(value);
      updateFiltersContext(value);
   };

   return (
      <div className="relative w-full" data-testid="search-filter">
         <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
         <Input
            placeholder="Vorlagen durchsuchen..."
            value={search}
            onChange={(e) => handleChange(e.target.value)}
            className="pl-9"
            data-testid="input"
         />
      </div>
   );
};

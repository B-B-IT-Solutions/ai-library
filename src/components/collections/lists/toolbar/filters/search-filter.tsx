"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useQueryState } from "nuqs";
import { useDebouncedCallback } from "use-debounce";

import { Input } from "@/components/shadcn/input";
import { collectionsSearchParams } from "../../../collections-search-params";

export const SearchFilter = () => {
   const [urlSearch, setUrlSearch] = useQueryState(
      "f_search",
      collectionsSearchParams["f_search"]
   );
   const [search, setSearch] = useState(urlSearch);

   useEffect(() => {
      setSearch(urlSearch);
   }, [urlSearch]);

   const updateUrl = useDebouncedCallback((value: string) => {
      setUrlSearch(value);
   }, 300);

   const handleChange = (value: string) => {
      setSearch(value);
      updateUrl(value);
   };

   const handleClear = () => {
      updateUrl.cancel();
      setSearch("");
      setUrlSearch("");
   };

   return (
      <div className="relative w-full" data-testid="search-filter">
         <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
         <Input
            placeholder="Sammlungen durchsuchen..."
            value={search}
            onChange={(e) => handleChange(e.target.value)}
            className="pr-9 pl-9"
            data-testid="input"
         />
         {search && (
            <button
               onClick={handleClear}
               className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
               aria-label="Suche löschen"
               data-testid="clear-btn"
            >
               <X className="h-4 w-4" />
            </button>
         )}
      </div>
   );
};

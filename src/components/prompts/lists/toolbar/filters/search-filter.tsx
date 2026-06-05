"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useQueryState } from "nuqs";
import { useDebouncedCallback } from "use-debounce";

import { Input } from "@/components/shadcn/input";
import { templatesSearchParams } from "../../../search-params";

export const SearchFilter = () => {
   const [urlSearch, setUrlSearch] = useQueryState(
      "f_search",
      templatesSearchParams["f_search"]
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

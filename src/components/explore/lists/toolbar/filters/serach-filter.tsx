"use client";

import { Search } from "lucide-react";
import { useQueryState } from "nuqs";

import { Input } from "@/components/shadcn/input";
import { f_searchParam } from "../../../catalog-search-params";

export const SearchFilter = () => {
   const [search, setSearch] = useQueryState(
      "f_search",
      f_searchParam.withOptions({ shallow: false })
   );

   return (
      <div className="relative" data-testid="search-filter">
         <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
         <Input
            data-testid="explore-search-input"
            placeholder="Suchen…"
            value={search || ""}
            onChange={(e) => setSearch(e.target.value || null)}
            className="h-9 w-full pl-9 sm:h-8 sm:w-64 sm:pl-9 sm:text-sm"
         />
      </div>
   );
};

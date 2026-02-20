"use client";

import { FC } from "react";
import { Search } from "lucide-react";
import { debounce, useQueryState } from "nuqs";

import { Input } from "@/components/shadcn/input";
import { librarySearchParams } from "../search-params";

export const SearchFilter: FC = () => {
   const [search, setSearch] = useQueryState(
      "f_search",
      librarySearchParams["f_search"]
   );

   const handleChange = (value: string) => {
      setSearch(value, {
         limitUrlUpdates: debounce(400),
      });
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

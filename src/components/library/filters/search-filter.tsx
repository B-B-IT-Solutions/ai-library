"use client";

import { Search } from "lucide-react";
import { FC, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { Input } from "@/components/shadcn/input";

import { useLibraryFilters } from "./library-filters-context";

export const SearchFilter: FC = () => {
   const context = useLibraryFilters();
   const [localValue, setLocalValue] = useState(context.filters.search || "");

   const debouncedUpdate = useDebouncedCallback((value: string) => {
      context.setFilters({ search: value || undefined });
   }, 300);

   const handleChange = (value: string) => {
      setLocalValue(value);
      debouncedUpdate(value);
   };

   return (
      <div className="relative w-full">
         <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
         <Input
            placeholder="Vorlagen durchsuchen..."
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            className="pl-9"
         />
      </div>
   );
};

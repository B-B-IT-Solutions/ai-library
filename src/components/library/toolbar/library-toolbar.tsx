"use client";

import { FC } from "react";

import { LibraryGroupBy, LibrarySortBy } from "@/data/types/domain/library";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/shadcn/select";

import { useLibraryFilters } from "../filters/library-filters-context";
import { ViewModeToggle } from "./view-mode-toggle";

type LibraryToolbarProps = {
   totalEntries: number;
};

export const LibraryToolbar: FC<LibraryToolbarProps> = ({ totalEntries }) => {
   const { viewMode, setViewMode, groupBy, setGroupBy, sortBy, setSortBy } =
      useLibraryFilters();

   return (
      <div className="border-b px-6 py-3 flex items-center justify-between bg-white">
         <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <ViewModeToggle value={viewMode} onChange={setViewMode} />

            {/* Group By */}
            <Select
               value={groupBy}
               onValueChange={(value) => setGroupBy(value as LibraryGroupBy)}
            >
               <SelectTrigger className="w-[180px] h-8">
                  <SelectValue placeholder="Gruppierung" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="none">Keine Gruppierung</SelectItem>
                  <SelectItem value="category">Nach Kategorie</SelectItem>
                  <SelectItem value="model">Nach Modell</SelectItem>
                  <SelectItem value="date">Nach Datum</SelectItem>
               </SelectContent>
            </Select>

            {/* Sort By */}
            <Select
               value={sortBy}
               onValueChange={(value) => setSortBy(value as LibrarySortBy)}
            >
               <SelectTrigger className="w-[180px] h-8">
                  <SelectValue placeholder="Sortierung" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="date-desc">Neueste zuerst</SelectItem>
                  <SelectItem value="date-asc">Älteste zuerst</SelectItem>
                  <SelectItem value="name-asc">Name A-Z</SelectItem>
                  <SelectItem value="name-desc">Name Z-A</SelectItem>
               </SelectContent>
            </Select>
         </div>

         {/* Entry Count */}
         <span className="text-sm text-slate-600">
            {totalEntries} {totalEntries === 1 ? "Vorlage" : "Vorlagen"}
         </span>
      </div>
   );
};

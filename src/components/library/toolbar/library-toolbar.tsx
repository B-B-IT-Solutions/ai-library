"use client";

import { FC } from "react";

import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/shadcn/select";
import { ListViewToggle } from "@/components/shared/buttons";
import { DListViewMode } from "@/data/types/domain/common";
import { LibraryGroupBy, LibrarySortBy } from "@/data/types/domain/library";
import { useLibraryFilters } from "../filters/library-filters-context";

type LibraryToolbarProps = {
   totalEntries: number;
   viewMode: DListViewMode;
};

export const LibraryToolbar: FC<LibraryToolbarProps> = ({
   totalEntries,
   viewMode,
}) => {
   const { groupBy, setGroupBy, sortBy, setSortBy } = useLibraryFilters();

   return (
      <div className="flex items-center justify-between border-b bg-white px-6 py-3">
         <div className="flex items-center gap-4">
            <ListViewToggle currentView={viewMode} />

            {/* Group By */}
            <Select
               value={groupBy}
               onValueChange={(value) => setGroupBy(value as LibraryGroupBy)}
            >
               <SelectTrigger className="h-8 w-[180px]">
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
               <SelectTrigger className="h-8 w-[180px]">
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

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
import { DListGroupByMode, DListViewMode } from "@/data/types/domain/common";
import { LibrarySortBy } from "@/data/types/domain/library";
import { useLibraryFilters } from "../filters/library-filters-context";

import { GroupBySelect } from "./group-by-select";

type Props = {
   viewMode: DListViewMode;
   groupBy: DListGroupByMode;
   totalEntries: number;
};

export const LibraryToolbar: FC<Props> = ({
   viewMode,
   groupBy,
   totalEntries,
}) => {
   const { sortBy, setSortBy } = useLibraryFilters();

   return (
      <div className="flex items-center justify-between border-b bg-white px-6 py-3">
         <div className="flex items-center gap-4">
            <ListViewToggle currentView={viewMode} />
            <GroupBySelect currentGroupBy={groupBy} />

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

         <span className="text-sm text-slate-600">
            {totalEntries} {totalEntries === 1 ? "Vorlage" : "Vorlagen"}
         </span>
      </div>
   );
};

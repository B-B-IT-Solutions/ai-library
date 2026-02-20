"use client";

import { FC } from "react";

import { ListViewToggle } from "@/components/shared/buttons";
import { DListViewMode } from "@/data/types/domain/common";
import { DLibraryEntriesFilter } from "@/data/types/domain/library";
import { LibraryFilters } from "../filters/library-filters";

import { GroupBySelect } from "./group-by-select";
import { SortBySelect } from "./sort-by-select";

type Props = {
   viewMode: DListViewMode;
   filters: DLibraryEntriesFilter;
   totalEntries: number;
};

export const LibraryToolbar: FC<Props> = ({
   viewMode,
   filters,
   totalEntries,
}) => {
   return (
      <div
         className="flex items-center justify-between border-b bg-white px-6 py-3"
         data-testid="library-toolbar"
      >
         <div className="flex items-center gap-4">
            <ListViewToggle currentView={viewMode} />
            <LibraryFilters filters={filters} />
            <GroupBySelect />
            <SortBySelect />
         </div>

         <span className="text-sm text-slate-600">
            {totalEntries} {totalEntries === 1 ? "Vorlage" : "Vorlagen"}
         </span>
      </div>
   );
};

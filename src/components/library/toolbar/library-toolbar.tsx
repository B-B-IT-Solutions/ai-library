"use client";

import { FC } from "react";

import { ListViewToggle } from "@/components/shared/buttons";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";

import { GroupBySelect } from "./group-by-select";
import { SortBySelect } from "./sort-by-select";

type Props = {
   viewMode: DListViewMode;
   groupBy: DListGroupByMode;
   sortBy: DListSortByMode;
   totalEntries: number;
};

export const LibraryToolbar: FC<Props> = ({
   viewMode,
   groupBy,
   sortBy,
   totalEntries,
}) => {
   return (
      <div className="flex items-center justify-between border-b bg-white px-6 py-3">
         <div className="flex items-center gap-4">
            <ListViewToggle currentView={viewMode} />
            <GroupBySelect currentGroupBy={groupBy} />
            <SortBySelect currentSortBy={sortBy} />
         </div>

         <span className="text-sm text-slate-600">
            {totalEntries} {totalEntries === 1 ? "Vorlage" : "Vorlagen"}
         </span>
      </div>
   );
};

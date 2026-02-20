"use client";

import { FC, useMemo } from "react";

import { useInfiniteLoadLibraryEntries } from "@/data/ts-queries/library";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { DLibraryEntriesFilter } from "@/data/types/domain/library";

import { CreateLibraryEntryButton } from "./buttons/create-library-entry-button";
import { LibraryEntries } from "./list/library-entries";
import { LibraryQuickNav } from "./navigation/library-quick-nav";
import { LibraryToolbar } from "./toolbar/library-toolbar";

type Props = {
   viewMode: DListViewMode;
   groupBy: DListGroupByMode;
   sortBy: DListSortByMode;
   filters: DLibraryEntriesFilter;
};

export const LibraryDashboard: FC<Props> = ({
   viewMode,
   groupBy,
   sortBy,
   filters,
}) => {
   // Get total entries count
   const { data } = useInfiniteLoadLibraryEntries({
      search: filters.search,
      categories: filters.categories,
      models: filters.models,
      isFavorite: filters.isFavorite,
      collectionIds: filters.collectionIds,
   });

   const totalEntries = useMemo(() => {
      if (!data?.pages) return 0;
      const firstPage = data.pages[0];
      return firstPage?.totalEntries || 0;
   }, [data]);

   return (
      <div className="flex h-full flex-col bg-slate-50">
         {/* Header */}
         <div className="space-y-4 border-b bg-white px-6 py-4">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                     Meine Bibliothek
                  </h1>
                  <p className="mt-1 text-sm text-slate-600">
                     Verwalten Sie Ihre gespeicherten Prompt-Vorlagen
                  </p>
               </div>
               <div className="flex items-center gap-3">
                  <CreateLibraryEntryButton />
               </div>
            </div>

            <LibraryQuickNav filters={filters} />
         </div>

         <LibraryToolbar
            viewMode={viewMode}
            filters={filters}
            totalEntries={totalEntries}
         />

         <div className="flex-1 overflow-y-auto">
            <LibraryEntries
               viewMode={viewMode}
               groupBy={groupBy}
               sortBy={sortBy}
               filters={filters}
            />
         </div>
      </div>
   );
};

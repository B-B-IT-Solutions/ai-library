"use client";

import { FC, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { useInfiniteLoadLibraryEntries } from "@/data/ts-queries/library";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { DLibraryEntriesFilter } from "@/data/types/domain/library";

import { CreateLibraryEntryButton } from "./buttons/create-library-entry-button";
import { LibraryFilters } from "./filters/library-filters";
import {
   LibraryFiltersContext,
   LibraryFiltersContextType,
} from "./filters/library-filters-context";
import { LibraryEntries } from "./list/library-entries";
import { LibraryQuickNav } from "./navigation/library-quick-nav";
import { LibraryToolbar } from "./toolbar/library-toolbar";

type Props = {
   viewMode: DListViewMode;
   groupBy: DListGroupByMode;
   sortBy: DListSortByMode;
   filters?: DLibraryEntriesFilter;
};

export const LibraryDashboard: FC<Props> = ({
   viewMode,
   groupBy,
   sortBy,
   filters = {},
}) => {
   const [filters_, setFiltersState] = useState<DLibraryEntriesFilter>({});
   const [showFilters, setShowFilters] = useState(false);

   const setFilters = (newFilters: Partial<DLibraryEntriesFilter>) => {
      setFiltersState((prev) => ({ ...prev, ...newFilters }));
   };

   const resetFilters = () => {
      setFiltersState({});
   };

   const hasActiveFilters = useMemo(() => {
      return (
         !!filters_.search ||
         (filters_.categories && filters_.categories.length > 0) ||
         (filters_.models && filters_.models.length > 0) ||
         filters_.isFavorite !== undefined ||
         (filters_.collectionIds && filters_.collectionIds.length > 0)
      );
   }, [filters_]);

   // Get total entries count
   const { data } = useInfiniteLoadLibraryEntries({
      search: filters_.search,
      categories: filters_.categories,
      models: filters_.models,
      isFavorite: filters_.isFavorite,
      collectionIds: filters_.collectionIds,
   });

   const totalEntries = useMemo(() => {
      if (!data?.pages) return 0;
      const firstPage = data.pages[0];
      return firstPage?.totalEntries || 0;
   }, [data]);

   const contextValue: LibraryFiltersContextType = {
      filters: filters_,
      setFilters,
      resetFilters,
      hasActiveFilters,
   };

   return (
      <LibraryFiltersContext.Provider value={contextValue}>
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
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="gap-2"
                     >
                        <Filter className="h-4 w-4" />
                        Filter
                        {showFilters ? (
                           <ChevronUp className="h-4 w-4" />
                        ) : (
                           <ChevronDown className="h-4 w-4" />
                        )}
                     </Button>
                     <CreateLibraryEntryButton />
                  </div>
               </div>

               <LibraryQuickNav />
            </div>

            {showFilters && (
               <div className="animate-in border-b bg-white px-6 py-4 duration-200 slide-in-from-top">
                  <LibraryFilters filters={filters} />
               </div>
            )}

            <LibraryToolbar
               totalEntries={totalEntries}
               viewMode={viewMode}
               groupBy={groupBy}
               sortBy={sortBy}
            />

            <div className="flex-1 overflow-y-auto">
               <LibraryEntries
                  viewMode={viewMode}
                  groupBy={groupBy}
                  sortBy={sortBy}
               />
            </div>
         </div>
      </LibraryFiltersContext.Provider>
   );
};

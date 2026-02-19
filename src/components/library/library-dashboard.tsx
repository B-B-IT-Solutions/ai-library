"use client";

import { FC, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Filter, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { useInfiniteLoadLibraryEntries } from "@/data/ts-queries/library";
import {
   DLibraryEntriesFilter,
   LibraryGroupBy,
   LibrarySortBy,
   LibraryViewMode,
} from "@/data/types/domain/library";

import { CreateLibraryEntryButton } from "./buttons/create-library-entry-button";
import { LibraryContent } from "./content/library-content";
import { LibraryFilters } from "./filters/library-filters";
import {
   LibraryFiltersContext,
   LibraryFiltersContextType,
} from "./filters/library-filters-context";
import { LibraryQuickNav } from "./navigation/library-quick-nav";
import { LibraryToolbar } from "./toolbar/library-toolbar";

const initFilters: DLibraryEntriesFilter = {
   search: undefined,
   categories: undefined,
   models: undefined,
   isFavorite: undefined,
   collectionIds: undefined,
};

export const LibraryDashboard: FC = () => {
   const [filters, setFiltersState] =
      useState<DLibraryEntriesFilter>(initFilters);
   const [showFilters, setShowFilters] = useState(false);
   const [viewMode, setViewMode] = useState<LibraryViewMode>("grid");
   const [groupBy, setGroupBy] = useState<LibraryGroupBy>("none");
   const [sortBy, setSortBy] = useState<LibrarySortBy>("date-desc");

   const setFilters = (newFilters: Partial<DLibraryEntriesFilter>) => {
      setFiltersState((prev) => ({ ...prev, ...newFilters }));
   };

   const resetFilters = () => {
      setFiltersState(initFilters);
   };

   const hasActiveFilters = useMemo(() => {
      return (
         !!filters.search ||
         (filters.categories && filters.categories.length > 0) ||
         (filters.models && filters.models.length > 0) ||
         filters.isFavorite !== undefined ||
         (filters.collectionIds && filters.collectionIds.length > 0)
      );
   }, [filters]);

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

   const contextValue: LibraryFiltersContextType = {
      filters,
      setFilters,
      resetFilters,
      hasActiveFilters,
      viewMode,
      setViewMode,
      groupBy,
      setGroupBy,
      sortBy,
      setSortBy,
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

               {/* Quick Navigation */}
               <LibraryQuickNav />
            </div>

            {/* Filters (collapsible) */}
            {showFilters && (
               <div className="animate-in border-b bg-white px-6 py-4 duration-200 slide-in-from-top">
                  <LibraryFilters />
               </div>
            )}

            {/* Toolbar */}
            <LibraryToolbar totalEntries={totalEntries} />

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
               <LibraryContent />
            </div>
         </div>
      </LibraryFiltersContext.Provider>
   );
};

"use client";

import { ChevronDown, ChevronUp, Filter, Plus } from "lucide-react";
import Link from "next/link";
import { FC, useMemo, useState } from "react";
import { flatMap } from "es-toolkit/compat";

import { useInfiniteLoadLibraryEntries } from "@/data/ts-queries/library";
import {
   DLibraryEntriesFilter,
   LibraryGroupBy,
   LibrarySortBy,
   LibraryViewMode,
} from "@/data/types/domain/library";
import { Button } from "@/components/shadcn/button";

import { LibraryContent } from "./content/library-content";
import {
   LibraryFiltersContext,
   LibraryFiltersContextType,
} from "./filters/library-filters-context";
import { LibraryFilters } from "./filters/library-filters";
import { LibraryToolbar } from "./toolbar/library-toolbar";

const initFilters: DLibraryEntriesFilter = {
   search: undefined,
   categories: undefined,
   models: undefined,
   isFavorite: undefined,
   collectionIds: undefined,
};

export const LibraryDashboard: FC = () => {
   const [filters, setFiltersState] = useState<DLibraryEntriesFilter>(initFilters);
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
         <div className="h-full flex flex-col bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
               <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                     Meine Bibliothek
                  </h1>
                  <p className="text-sm text-slate-600 mt-1">
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
                  <Button asChild size="sm" className="gap-2">
                     <Link href="/library/new">
                        <Plus className="h-4 w-4" />
                        Neue Vorlage
                     </Link>
                  </Button>
               </div>
            </div>

            {/* Filters (collapsible) */}
            {showFilters && (
               <div className="bg-white border-b px-6 py-4 animate-in slide-in-from-top duration-200">
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

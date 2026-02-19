"use client";

import { createContext, useContext } from "react";

import {
   DLibraryEntriesFilter,
   LibraryGroupBy,
   LibrarySortBy,
} from "@/data/types/domain/library";

export type LibraryFiltersContextType = {
   filters: DLibraryEntriesFilter;
   setFilters: (filters: Partial<DLibraryEntriesFilter>) => void;
   resetFilters: () => void;
   hasActiveFilters?: boolean;
   groupBy: LibraryGroupBy;
   setGroupBy: (groupBy: LibraryGroupBy) => void;
   sortBy: LibrarySortBy;
   setSortBy: (sortBy: LibrarySortBy) => void;
};

export const LibraryFiltersContext = createContext<
   LibraryFiltersContextType | undefined
>(undefined);

export const useLibraryFilters = () => {
   const context = useContext(LibraryFiltersContext);
   if (!context) {
      throw new Error(
         "useLibraryFilters must be used within LibraryFiltersContext.Provider"
      );
   }
   return context;
};

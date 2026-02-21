import { createContext, useContext } from "react";

import { DLibraryEntriesFilter } from "@/data/types/domain/library";

export class LibraryEntryFiltersHelper {
   private filters: DLibraryEntriesFilter;

   constructor(filters: DLibraryEntriesFilter) {
      this.filters = filters;
   }

   getFilters() {
      return {
         f_search: this.filters.search,
      };
   }

   setSearch(value: string) {
      this.filters.search = value;
   }

   getSearch(): string {
      return this.filters.search || "";
   }
}

export const LibraryEntryFilterContext =
   createContext<LibraryEntryFiltersHelper>(new LibraryEntryFiltersHelper({}));

export const useLibraryEntryFiltersContext = () => {
   const context = useContext(LibraryEntryFilterContext);
   if (!context) {
      throw new Error(
         "useLibraryEntryFiltersContext can only be used within LibraryEntryFilterContext.Provider"
      );
   }
   return context;
};

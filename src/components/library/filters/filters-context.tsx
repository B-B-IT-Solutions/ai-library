import { createContext, useContext } from "react";

import { DLibraryEntriesFilter } from "@/data/types/domain/library";
import { DLibrarySearchParamsFiltersType } from "../search-params";

export class LibraryEntryFiltersHelper {
   private filters: DLibraryEntriesFilter;

   constructor(filters: DLibraryEntriesFilter) {
      this.filters = filters;
   }

   getFilters(): DLibrarySearchParamsFiltersType {
      return {
         f_search: this.filters.search,
         f_categories: this.filters.categories,
         f_models: this.filters.models,
      };
   }

   setSearch(value: string) {
      this.filters.search = value;
   }

   getSearch(): string {
      return this.filters.search || "";
   }

   setCategories(categories: string[]) {
      this.filters.categories = categories;
   }

   getCategories(): string[] {
      return this.filters.categories || [];
   }

   setModels(models: string[]) {
      this.filters.models = models;
   }

   getModels(): string[] {
      return this.filters.models || [];
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

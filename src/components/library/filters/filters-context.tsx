import { createContext, useContext } from "react";

import { DLibrarySearchParamsFiltersType } from "../search-params";

export class LibraryEntryFiltersHelper {
   private filters: DLibrarySearchParamsFiltersType;

   constructor(filters: DLibrarySearchParamsFiltersType) {
      this.filters = filters;
   }

   getFilters(): DLibrarySearchParamsFiltersType {
      return this.filters;
   }

   setSearch(value: string) {
      this.filters.f_search = value;
   }

   getSearch(): string {
      return this.filters.f_search || "";
   }

   setCategories(categories: string[]) {
      this.filters.f_categories = categories;
   }

   getCategories(): string[] {
      return this.filters.f_categories || [];
   }

   setModels(models: string[]) {
      this.filters.f_models = models;
   }

   getModels(): string[] {
      return this.filters.f_models || [];
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

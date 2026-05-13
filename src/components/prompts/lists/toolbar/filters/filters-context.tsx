import { createContext, useContext } from "react";

import { DTemplatesSearchParamsFiltersType } from "../../../search-params";

export class LibraryEntryFiltersHelper {
   private filters: DTemplatesSearchParamsFiltersType;

   constructor(filters: DTemplatesSearchParamsFiltersType) {
      this.filters = filters;
   }

   getFilters(): DTemplatesSearchParamsFiltersType {
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
   return useContext(LibraryEntryFilterContext);
};

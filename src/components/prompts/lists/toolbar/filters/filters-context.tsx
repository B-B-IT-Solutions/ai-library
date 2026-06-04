import { createContext, useContext } from "react";
import { isEmpty } from "es-toolkit/compat";

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

   hasActiveFilters(): boolean {
      return (
         !isEmpty(this.getSearch()) ||
         !isEmpty(this.getCategories()) ||
         !isEmpty(this.getModels())
      );
   }

   getActiveFiltersCount(): number {
      let count = 0;
      if (!isEmpty(this.getSearch())) {
         count++;
      }
      if (!isEmpty(this.getCategories())) {
         count++;
      }
      if (!isEmpty(this.getModels())) {
         count++;
      }
      return count;
   }

   resetFilters(): void {
      this.setSearch("");
      this.setCategories([]);
      this.setModels([]);
   }
}

export const LibraryEntryFilterContext =
   createContext<LibraryEntryFiltersHelper>(new LibraryEntryFiltersHelper({}));

export const useLibraryEntryFiltersContext = () => {
   return useContext(LibraryEntryFilterContext);
};

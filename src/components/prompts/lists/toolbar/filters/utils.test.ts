import { DTemplatesSearchParamsFiltersType } from "@/components/prompts/search-params";

import { activeFiltersCount } from "./utils";

describe("activeFiltersCount", () => {
   it("returns 0 when no filters are set", () => {
      const filters: DTemplatesSearchParamsFiltersType = {};
      expect(activeFiltersCount(filters)).toBe(0);
   });

   it("returns 0 when only search is set", () => {
      const filters: DTemplatesSearchParamsFiltersType = { f_search: "hello" };
      expect(activeFiltersCount(filters)).toBe(0);
   });

   it("returns 1 when only categories are set", () => {
      const filters: DTemplatesSearchParamsFiltersType = {
         f_categories: ["cat1"],
      };
      expect(activeFiltersCount(filters)).toBe(1);
   });

   it("returns 1 when only models are set", () => {
      const filters: DTemplatesSearchParamsFiltersType = {
         f_models: ["model1"],
      };
      expect(activeFiltersCount(filters)).toBe(1);
   });

   it("returns 1 when only collectionIds are set", () => {
      const filters: DTemplatesSearchParamsFiltersType = {
         f_collectionIds: ["col1"],
      };
      expect(activeFiltersCount(filters)).toBe(1);
   });

   it("returns 1 when search and categories are set", () => {
      const filters: DTemplatesSearchParamsFiltersType = {
         f_search: "hello",
         f_categories: ["cat1"],
      };
      expect(activeFiltersCount(filters)).toBe(1);
   });

   it("returns 3 when all popover filters are set", () => {
      const filters: DTemplatesSearchParamsFiltersType = {
         f_search: "hello",
         f_categories: ["cat1"],
         f_models: ["model1"],
         f_collectionIds: ["col1"],
      };
      expect(activeFiltersCount(filters)).toBe(3);
   });

   it("returns 0 when filters are empty values", () => {
      const filters: DTemplatesSearchParamsFiltersType = {
         f_search: "",
         f_categories: [],
         f_models: [],
         f_collectionIds: [],
      };
      expect(activeFiltersCount(filters)).toBe(0);
   });
});

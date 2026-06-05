import { DTemplatesSearchParamsFiltersType } from "@/components/prompts/search-params";

import { activeFiltersCount } from "./utils";

describe("activeFiltersCount", () => {
   it("returns 0 when no filters are set", () => {
      const filters: DTemplatesSearchParamsFiltersType = {};
      expect(activeFiltersCount(filters)).toBe(0);
   });

   it("returns 1 when only search is set", () => {
      const filters: DTemplatesSearchParamsFiltersType = { f_search: "hello" };
      expect(activeFiltersCount(filters)).toBe(1);
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

   it("returns 2 when search and categories are set", () => {
      const filters: DTemplatesSearchParamsFiltersType = {
         f_search: "hello",
         f_categories: ["cat1"],
      };
      expect(activeFiltersCount(filters)).toBe(2);
   });

   it("returns 3 when all filters are set", () => {
      const filters: DTemplatesSearchParamsFiltersType = {
         f_search: "hello",
         f_categories: ["cat1"],
         f_models: ["model1"],
      };
      expect(activeFiltersCount(filters)).toBe(3);
   });

   it("returns 0 when filters are empty values", () => {
      const filters: DTemplatesSearchParamsFiltersType = {
         f_search: "",
         f_categories: [],
         f_models: [],
      };
      expect(activeFiltersCount(filters)).toBe(0);
   });
});

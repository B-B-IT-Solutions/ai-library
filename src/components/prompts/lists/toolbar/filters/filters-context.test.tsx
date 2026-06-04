import React from "react";
import { renderHook } from "@testing-library/react";

import { DTemplatesSearchParamsFiltersType } from "../../../search-params";

import {
   LibraryEntryFilterContext,
   LibraryEntryFiltersHelper,
   useLibraryEntryFiltersContext,
} from "./filters-context";

describe("LibraryEntryFiltersHelper tests", () => {
   it("getFilters test", () => {
      const filters = { f_search: "test" };
      const helper = new LibraryEntryFiltersHelper(filters);
      expect(helper.getFilters()).toBe(filters);
   });

   it("getSearch test", () => {
      const helper1 = new LibraryEntryFiltersHelper({});
      expect(helper1.getSearch()).toBe("");

      const helper2 = new LibraryEntryFiltersHelper({ f_search: "hello" });
      expect(helper2.getSearch()).toBe("hello");
   });

   it("setSearch test", () => {
      const helper = new LibraryEntryFiltersHelper({});
      expect(helper.getSearch()).toBe("");

      helper.setSearch("new search");
      expect(helper.getSearch()).toBe("new search");
   });

   it("getCategories test", () => {
      const helper1 = new LibraryEntryFiltersHelper({});
      expect(helper1.getCategories()).toEqual([]);

      const helper2 = new LibraryEntryFiltersHelper({
         f_categories: ["cat1", "cat2"],
      });
      expect(helper2.getCategories()).toEqual(["cat1", "cat2"]);
   });

   it("getCategories test", () => {
      const helper = new LibraryEntryFiltersHelper({});
      expect(helper.getCategories()).toEqual([]);

      helper.setCategories(["a", "b"]);
      expect(helper.getCategories()).toEqual(["a", "b"]);
   });

   it("getModels test", () => {
      const helper1 = new LibraryEntryFiltersHelper({});
      expect(helper1.getModels()).toEqual([]);

      const helper2 = new LibraryEntryFiltersHelper({
         f_models: ["mod-1", "mod-2", "mod-3"],
      });
      expect(helper2.getModels()).toEqual(["mod-1", "mod-2", "mod-3"]);
   });

   it("setModels test", () => {
      const helper = new LibraryEntryFiltersHelper({});
      expect(helper.getModels()).toEqual([]);

      helper.setModels(["x", "y"]);
      expect(helper.getModels()).toEqual(["x", "y"]);
   });

   describe("hasActiveFilters", () => {
      it("returns false when no filters are set", () => {
         const helper = new LibraryEntryFiltersHelper({});
         expect(helper.hasActiveFilters()).toBe(false);
      });

      it("returns true when search is set", () => {
         const helper = new LibraryEntryFiltersHelper({ f_search: "hello" });
         expect(helper.hasActiveFilters()).toBe(true);
      });

      it("returns true when categories are set", () => {
         const helper = new LibraryEntryFiltersHelper({
            f_categories: ["cat1"],
         });
         expect(helper.hasActiveFilters()).toBe(true);
      });

      it("returns true when models are set", () => {
         const helper = new LibraryEntryFiltersHelper({ f_models: ["model1"] });
         expect(helper.hasActiveFilters()).toBe(true);
      });

      it("returns true when all filters are set", () => {
         const helper = new LibraryEntryFiltersHelper({
            f_search: "hello",
            f_categories: ["cat1"],
            f_models: ["model1"],
         });
         expect(helper.hasActiveFilters()).toBe(true);
      });

      it("returns false when search is empty string", () => {
         const helper = new LibraryEntryFiltersHelper({ f_search: "" });
         expect(helper.hasActiveFilters()).toBe(false);
      });

      it("returns false when arrays are empty", () => {
         const helper = new LibraryEntryFiltersHelper({
            f_categories: [],
            f_models: [],
         });
         expect(helper.hasActiveFilters()).toBe(false);
      });
   });

   describe("getActiveFiltersCount", () => {
      it("returns 0 when no filters are set", () => {
         const helper = new LibraryEntryFiltersHelper({});
         expect(helper.getActiveFiltersCount()).toBe(0);
      });

      it("returns 1 when only search is set", () => {
         const helper = new LibraryEntryFiltersHelper({ f_search: "hello" });
         expect(helper.getActiveFiltersCount()).toBe(1);
      });

      it("returns 1 when only categories are set", () => {
         const helper = new LibraryEntryFiltersHelper({
            f_categories: ["cat1"],
         });
         expect(helper.getActiveFiltersCount()).toBe(1);
      });

      it("returns 1 when only models are set", () => {
         const helper = new LibraryEntryFiltersHelper({ f_models: ["model1"] });
         expect(helper.getActiveFiltersCount()).toBe(1);
      });

      it("returns 2 when search and categories are set", () => {
         const helper = new LibraryEntryFiltersHelper({
            f_search: "hello",
            f_categories: ["cat1"],
         });
         expect(helper.getActiveFiltersCount()).toBe(2);
      });

      it("returns 3 when all filters are set", () => {
         const helper = new LibraryEntryFiltersHelper({
            f_search: "hello",
            f_categories: ["cat1"],
            f_models: ["model1"],
         });
         expect(helper.getActiveFiltersCount()).toBe(3);
      });

      it("returns 0 when filters are empty values", () => {
         const helper = new LibraryEntryFiltersHelper({
            f_search: "",
            f_categories: [],
            f_models: [],
         });
         expect(helper.getActiveFiltersCount()).toBe(0);
      });
   });

   describe("resetFilters", () => {
      it("clears all filters", () => {
         const helper = new LibraryEntryFiltersHelper({
            f_search: "hello",
            f_categories: ["cat1"],
            f_models: ["model1"],
         });

         helper.resetFilters();

         expect(helper.getSearch()).toBe("");
         expect(helper.getCategories()).toEqual([]);
         expect(helper.getModels()).toEqual([]);
      });

      it("leaves hasActiveFilters as false after reset", () => {
         const helper = new LibraryEntryFiltersHelper({
            f_search: "hello",
            f_categories: ["cat1"],
            f_models: ["model1"],
         });

         helper.resetFilters();

         expect(helper.hasActiveFilters()).toBe(false);
      });

      it("leaves getActiveFiltersCount as 0 after reset", () => {
         const helper = new LibraryEntryFiltersHelper({
            f_search: "hello",
            f_categories: ["cat1"],
            f_models: ["model1"],
         });

         helper.resetFilters();

         expect(helper.getActiveFiltersCount()).toBe(0);
      });

      it("is a no-op on already empty filters", () => {
         const helper = new LibraryEntryFiltersHelper({});

         helper.resetFilters();

         expect(helper.getSearch()).toBe("");
         expect(helper.getCategories()).toEqual([]);
         expect(helper.getModels()).toEqual([]);
      });
   });
});

describe("useLibraryEntryFiltersContex tests", () => {
   it("useLibraryEntryFiltersContex - without a Provider - the default context value - test", () => {
      const { result } = renderHook(() => useLibraryEntryFiltersContext());

      expect(result.current).toBeInstanceOf(LibraryEntryFiltersHelper);
      expect(result.current.getSearch()).toBe("");
      expect(result.current.getCategories()).toEqual([]);
      expect(result.current.getModels()).toEqual([]);
   });

   it("useLibraryEntryFiltersContex - within a Provider - the provided context value - test", () => {
      const filters: DTemplatesSearchParamsFiltersType = {
         f_search: "test",
         f_categories: ["cat1"],
         f_models: ["model1"],
      };
      const helper = new LibraryEntryFiltersHelper(filters);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
         <LibraryEntryFilterContext.Provider value={helper}>
            {children}
         </LibraryEntryFilterContext.Provider>
      );

      const { result } = renderHook(() => useLibraryEntryFiltersContext(), {
         wrapper,
      });

      expect(result.current).toBe(helper);
      expect(result.current.getSearch()).toBe("test");
      expect(result.current.getCategories()).toEqual(["cat1"]);
      expect(result.current.getModels()).toEqual(["model1"]);
   });
});

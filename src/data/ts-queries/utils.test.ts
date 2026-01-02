import { dtestData } from "@tests";

import { Filter, Sort } from "@/data/types/common";

import {
   filterQueryKey,
   getNextPageParam,
   pageQuery,
   pageQueryKey,
   paramQueryKey,
} from "./utils";

describe("getNextPageParam", () => {
   test("getNextPageParam - totalPages 50 -  test", async () => {
      const page = dtestData.dPromptDescriptorsPage();
      page.pageNumber = 0;
      page.totalPages = 50;
      expect(getNextPageParam(page)).toEqual(1);
      page.pageNumber = 1;
      expect(getNextPageParam(page)).toEqual(2);
      page.pageNumber = 2;
      expect(getNextPageParam(page)).toEqual(3);
      page.pageNumber = 3;
      expect(getNextPageParam(page)).toEqual(4);
      page.pageNumber = 48;
      expect(getNextPageParam(page)).toEqual(49);
      page.pageNumber = 49;
      expect(getNextPageParam(page)).toBeNull();
      page.pageNumber = 50;
      expect(getNextPageParam(page)).toBeNull();
   });

   test("getNextPageParam - totalPages 5 -  test", async () => {
      const page = dtestData.dPromptDescriptorsPage();
      page.pageNumber = 0;
      page.totalPages = 5;
      expect(getNextPageParam(page)).toEqual(1);
      page.pageNumber = 1;
      expect(getNextPageParam(page)).toEqual(2);
      page.pageNumber = 2;
      expect(getNextPageParam(page)).toEqual(3);
      page.pageNumber = 3;
      expect(getNextPageParam(page)).toEqual(4);
      page.pageNumber = 48;
      expect(getNextPageParam(page)).toBeNull();
      page.pageNumber = 49;
      expect(getNextPageParam(page)).toBeNull();
      page.pageNumber = 50;
      expect(getNextPageParam(page)).toBeNull();
   });

   test("getNextPageParam - totalPages 0 -  test", async () => {
      const page = dtestData.dPromptDescriptorsPage();
      page.pageNumber = 0;
      page.totalPages = 0;
      expect(getNextPageParam(page)).toBeNull();
      page.pageNumber = 1;
      expect(getNextPageParam(page)).toBeNull();
      page.pageNumber = 2;
      expect(getNextPageParam(page)).toBeNull();
      page.pageNumber = 3;
      expect(getNextPageParam(page)).toBeNull();
      page.pageNumber = 48;
      expect(getNextPageParam(page)).toBeNull();
      page.pageNumber = 49;
      expect(getNextPageParam(page)).toBeNull();
      page.pageNumber = 50;
      expect(getNextPageParam(page)).toBeNull();
   });
});

describe("pageQuery tests", () => {
   const expectedQuery = (
      pageNumber: number,
      pageSize: number,
      globalFilter?: string,
      filter?: Filter,
      sort?: Sort
   ) => {
      return {
         pagination: { pageNumber, pageSize },
         globalFilter,
         filter,
         sort,
      };
   };

   test("pageQuery  - without filter -  test", async () => {
      expect(pageQuery(0, 5)).toEqual(expectedQuery(0, 5));
      expect(pageQuery(1, 10)).toEqual(expectedQuery(1, 10));
      expect(pageQuery(5, 10)).toEqual(expectedQuery(5, 10));
      expect(pageQuery(7, 7)).toEqual(expectedQuery(7, 7));
      expect(pageQuery(9, 10)).toEqual(expectedQuery(9, 10));
   });

   test("pageQuery  - with filter -  test", async () => {
      const globalFilter = "test 1";
      const filter = dtestData.dPromptsFilter();
      expect(pageQuery(5, 10, globalFilter, filter)).toEqual(
         expectedQuery(5, 10, globalFilter, filter)
      );
   });

   test("pageQuery  - with filter + sort -  test", async () => {
      const globalFilter = "test 1";
      const promptsFilter = dtestData.dPromptsFilter();
      const sort1 = dtestData.sort("field1", true);
      expect(pageQuery(5, 10, globalFilter, promptsFilter, sort1)).toEqual(
         expectedQuery(5, 10, globalFilter, promptsFilter, sort1)
      );
   });
});

describe("pageQueryKey tests", () => {
   test("pageQueryKey  test", async () => {
      expect(pageQueryKey()).toEqual({});
      const query = dtestData.dPromptsPageQuery();
      expect(pageQueryKey(query)).toEqual({ query });
   });
});

describe("filterQueryKey tests", () => {
   test("filterQueryKey  test", async () => {
      expect(filterQueryKey()).toEqual({});

      const filter = dtestData.dPromptsFilter();
      expect(filterQueryKey(filter)).toEqual({ filter });

      const sort = dtestData.sort();
      expect(filterQueryKey(undefined, sort)).toEqual({ sort });

      expect(filterQueryKey(filter, sort)).toEqual({ filter, sort });
   });
});

describe("paramQueryKey tests", () => {
   test("paramQueryKey - test", async () => {
      expect(paramQueryKey()).toEqual({});
      expect(paramQueryKey({})).toEqual({ params: {} });
      expect(paramQueryKey({ search: "test 1" })).toEqual({
         params: { search: "test 1" },
      });
   });
});

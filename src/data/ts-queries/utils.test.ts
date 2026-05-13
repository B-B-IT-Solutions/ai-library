import { dtestData } from "@tests";

import { Filter, Sort } from "@/data/types/common";

import {
   filterQueryKey,
   getNextPageParam,
   pageQuery,
   pageQueryKey,
   paramQueryKey,
   resolveSort,
} from "./utils";

describe("getNextPageParam", () => {
   test("getNextPageParam - totalPages 50 -  test", async () => {
      const page = dtestData.dPrompt0sPage();
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
      const page = dtestData.dPrompt0sPage();
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
      const page = dtestData.dPrompt0sPage();
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
      const filter = dtestData.dPrompt0sFilter();
      expect(pageQuery(5, 10, globalFilter, filter)).toEqual(
         expectedQuery(5, 10, globalFilter, filter)
      );
   });

   test("pageQuery  - with filter + sort -  test", async () => {
      const globalFilter = "test 1";
      const promptsFilter = dtestData.dPrompt0sFilter();
      const sort1 = dtestData.sort("field1", "desc");
      expect(pageQuery(5, 10, globalFilter, promptsFilter, sort1)).toEqual(
         expectedQuery(5, 10, globalFilter, promptsFilter, sort1)
      );
   });
});

describe("pageQueryKey tests", () => {
   test("pageQueryKey  test", async () => {
      expect(pageQueryKey()).toEqual({});
      const query = dtestData.dPrompt0sPageQuery();
      expect(pageQueryKey(query)).toEqual({ query });
   });
});

describe("filterQueryKey tests", () => {
   test("filterQueryKey  test", async () => {
      expect(filterQueryKey()).toEqual({});

      const filters = dtestData.dPrompt0sFilter();
      expect(filterQueryKey(filters)).toEqual({ filters });

      const sort = dtestData.sort();
      expect(filterQueryKey(undefined, sort)).toEqual({ sort });

      expect(filterQueryKey(filters, sort)).toEqual({ filters, sort });
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

describe("resolveSort tests", () => {
   test("resolveSort - undefined - test", () => {
      expect(resolveSort(undefined)).toBeUndefined();
   });

   test("resolveSort - empty string - test", () => {
      expect(resolveSort("")).toBeUndefined();
   });

   test("resolveSort - no match - test", () => {
      expect(resolveSort("createdAt")).toBeUndefined();
      expect(resolveSort("desc-createdAt")).toBeUndefined();
      expect(resolveSort("asc createdAt")).toBeUndefined();
      expect(resolveSort("(createdAt)")).toBeUndefined();
   });

   test("resolveSort - asc(field) - test", () => {
      const result = resolveSort("asc(createdAt)");
      const expectedResult: Sort = {
         field: "createdAt",
         order: "asc",
      };
      expect(result).toEqual(expectedResult);
   });

   test("resolveSort - desc(field) - test", () => {
      const result = resolveSort("desc(createdAt)");
      const expectedResult: Sort = {
         field: "createdAt",
         order: "desc",
      };
      expect(result).toEqual(expectedResult);
   });

   test("resolveSort - asc(title) - test", () => {
      const result = resolveSort("asc(title)");
      const expectedResult: Sort = {
         field: "title",
         order: "asc",
      };
      expect(result).toEqual(expectedResult);
   });

   test("resolveSort - desc(title) - test", () => {
      const result = resolveSort("desc(title)");
      const expectedResult: Sort = {
         field: "title",
         order: "desc",
      };
      expect(result).toEqual(expectedResult);
   });
});

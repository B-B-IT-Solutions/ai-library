import { dtestData } from "@tests";

import { Sort } from "@/data/types/common";
import { DCatalogEntriesFilter } from "@/data/types/domain/catalog";
import {
   CatalogEntryOrderByWithRelationInput,
   CatalogEntryWhereInput,
} from "@/generated/prisma/models";

import { resolveOrderBy, resolveWhereInput } from "./utils";

describe("resolveWhereInput tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("filter undefined - test", async () => {
      const result = resolveWhereInput();
      const expectedWhere: CatalogEntryWhereInput = {
         status: "PUBLISHED",
      };
      expect(result).toEqual(expectedWhere);
   });

   test("filter.search - test", async () => {
      const filter: DCatalogEntriesFilter = {
         search: "test search",
      };

      const result = resolveWhereInput(filter);

      const expectedWhere: CatalogEntryWhereInput = {
         status: "PUBLISHED",
         OR: [
            {
               title: {
                  contains: "test search",
                  mode: "insensitive",
               },
            },
            {
               description: {
                  contains: "test search",
                  mode: "insensitive",
               },
            },
         ],
      };

      expect(result).toEqual(expectedWhere);
   });

   test("fitler.categories - test", async () => {
      const filter: DCatalogEntriesFilter = {
         categories: ["cat1", "cat2"],
      };
      const result = resolveWhereInput(filter);

      const expectedWhere: CatalogEntryWhereInput = {
         status: "PUBLISHED",
         category: {
            slug: { in: ["cat1", "cat2"] },
         },
      };

      expect(result).toEqual(expectedWhere);
   });

   test("filter empty - test", async () => {
      const filter: DCatalogEntriesFilter = {
         categories: [],
      };
      const result = resolveWhereInput(filter);

      const expectedWhere: CatalogEntryWhereInput = {
         status: "PUBLISHED",
      };

      expect(result).toEqual(expectedWhere);
   });

   test("filter - all fields - test", async () => {
      const filter = dtestData.dCatalogEntriesFilter();

      const result = resolveWhereInput(filter);

      const expectedWhere: CatalogEntryWhereInput = {
         status: "PUBLISHED",
         OR: [
            {
               title: {
                  contains: filter.search,
                  mode: "insensitive",
               },
            },
            {
               description: {
                  contains: filter.search,
                  mode: "insensitive",
               },
            },
         ],
         category: {
            slug: { in: filter.categories },
         },
      };

      expect(result).toEqual(expectedWhere);
   });
});

describe("resolveOrderBy tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("sort undefined - test", async () => {
      const result = resolveOrderBy();
      const expectedInput: CatalogEntryOrderByWithRelationInput = {
         createdAt: "desc" as const,
      };
      expect(result).toEqual(expectedInput);
   });

   test("sort defined - test", async () => {
      const sort: Sort = {
         field: "title",
         order: "asc",
      };
      const result = resolveOrderBy(sort);
      const expectedInput: CatalogEntryOrderByWithRelationInput = {
         title: "asc" as const,
      };
      expect(result).toEqual(expectedInput);
   });
});

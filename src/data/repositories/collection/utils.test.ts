import { Sort } from "@/data/types/common";
import { DCollectionsFilter } from "@/data/types/domain/collection";
import {
   LibraryCollectionOrderByWithRelationInput,
   LibraryCollectionWhereInput,
} from "@/generated/prisma/models";

import { resolveOrderBy, resolveWhereInput } from "./utils";

describe("resolveWhereInput tests", () => {
   const userId = "user-id-1";

   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("userId undefined - filter undefined - test", async () => {
      const result = resolveWhereInput();
      const expectedWhere: LibraryCollectionWhereInput = {};
      expect(result).toEqual(expectedWhere);
   });

   test("filter undefined - test", async () => {
      const result = resolveWhereInput(userId);
      const expectedWhere: LibraryCollectionWhereInput = { userId };
      expect(result).toEqual(expectedWhere);
   });

   test("filter.search - test", async () => {
      const filter: DCollectionsFilter = { search: "test search" };
      const result = resolveWhereInput(userId, filter);

      const expectedWhere: LibraryCollectionWhereInput = {
         userId,
         OR: [
            { name: { contains: "test search", mode: "insensitive" } },
            { description: { contains: "test search", mode: "insensitive" } },
         ],
      };

      expect(result).toEqual(expectedWhere);
   });

   test("filter empty - test", async () => {
      const filter: DCollectionsFilter = {};
      const result = resolveWhereInput(userId, filter);

      const expectedWhere: LibraryCollectionWhereInput = { userId };
      expect(result).toEqual(expectedWhere);
   });
});

describe("resolveOrderBy tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("sort undefined - test", async () => {
      const result = resolveOrderBy();
      const expected: LibraryCollectionOrderByWithRelationInput = {
         createdAt: "desc",
      };
      expect(result).toEqual(expected);
   });

   test("sort defined - test", async () => {
      const sort: Sort = { field: "name", order: "asc" };
      const result = resolveOrderBy(sort);
      const expected: LibraryCollectionOrderByWithRelationInput = {
         name: "asc",
      };
      expect(result).toEqual(expected);
   });
});

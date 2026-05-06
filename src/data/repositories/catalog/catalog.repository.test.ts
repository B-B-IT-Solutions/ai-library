import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { DCatalogEntriesPage } from "@/data/types/domain/catalog";
import {
   CatalogEntryCountArgs,
   CatalogEntryFindFirstArgs,
   CatalogEntryFindManyArgs,
   CatalogEntryUpdateArgs,
} from "@/generated/prisma/models";

import {
   toDCatalogCategory,
   toDCatalogEntries,
   toDCatalogEntryWithContent,
} from "./catalog.mapper";
import { CatalogRepository } from "./catalog.repository";
import { resolveOrderBy, resolveWhereInput } from "./utils";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const catalogRepository = new CatalogRepository(prismaMock);

describe("pGetPublishedEntriesPage tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("no query - test", async () => {
      const totalElements = 20;
      const entries = ptestData.pCatalogEntriesWithRelations();
      prismaMock.catalogEntry.findMany.mockResolvedValue(entries);
      prismaMock.catalogEntry.count.mockResolvedValue(totalElements);

      const result = await catalogRepository.pGetPublishedEntriesPage();

      const expectedResult: DCatalogEntriesPage = {
         content: toDCatalogEntries(entries),
         pageNumber: 0,
         pageSize: 12,
         numberOfElements: entries.length,
         totalPages: Math.ceil(totalElements / 12),
         totalElements,
      };

      const expectedWhere = resolveWhereInput();
      const expectedOrderBy = resolveOrderBy();

      const expectedFindManyArgs: CatalogEntryFindManyArgs = {
         where: expectedWhere,
         include: {
            category: true,
            fields: true,
         },
         orderBy: expectedOrderBy,
         skip: 0,
         take: 12,
      };

      const expectedCountArgs: CatalogEntryCountArgs = {
         where: expectedWhere,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.catalogEntry.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.catalogEntry.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.catalogEntry.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.catalogEntry.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   it("with query - test", async () => {
      const totalElements = 20;
      const entries = ptestData.pCatalogEntriesWithRelations();
      prismaMock.catalogEntry.findMany.mockResolvedValue(entries);
      prismaMock.catalogEntry.count.mockResolvedValue(totalElements);

      const query = dtestData.dCatalogEntriesPageQuery();
      const result = await catalogRepository.pGetPublishedEntriesPage(query);

      const expectedResult: DCatalogEntriesPage = {
         content: toDCatalogEntries(entries),
         pageNumber: 1,
         pageSize: 10,
         numberOfElements: entries.length,
         totalPages: Math.ceil(totalElements / 12),
         totalElements,
      };

      const expectedWhere = resolveWhereInput(query.filter);
      const expectedOrderBy = resolveOrderBy(query.sort);

      const expectedFindManyArgs: CatalogEntryFindManyArgs = {
         where: expectedWhere,
         include: {
            category: true,
            fields: true,
         },
         orderBy: expectedOrderBy,
         skip: 10,
         take: 10,
      };

      const expectedCountArgs: CatalogEntryCountArgs = {
         where: expectedWhere,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.catalogEntry.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.catalogEntry.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.catalogEntry.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.catalogEntry.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });
});

describe("pGetPublishedEntryById tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("entry null - test", async () => {
      prismaMock.catalogEntry.findFirst.mockResolvedValue(null);

      const entryId = "entry-id-1";

      const result = await catalogRepository.pGetPublishedEntryById(entryId);

      const expectedArgs: CatalogEntryFindFirstArgs = {
         where: {
            id: entryId,
            status: "PUBLISHED",
         },
         include: {
            category: true,
            fields: true,
            content: true,
         },
      };

      expect(result).toBeNull();
      expect(prismaMock.catalogEntry.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.catalogEntry.findFirst).toHaveBeenCalledWith(
         expectedArgs
      );
   });

   it("entry retrieved - test", async () => {
      const entry = ptestData.pCatalogEntryWithContent(1);
      prismaMock.catalogEntry.findFirst.mockResolvedValue(entry);

      const entryId = "entry-id-1";

      const result = await catalogRepository.pGetPublishedEntryById(entryId);

      const expectedResult = toDCatalogEntryWithContent(entry);

      const expectedArgs: CatalogEntryFindFirstArgs = {
         where: {
            id: entryId,
            status: "PUBLISHED",
         },
         include: {
            category: true,
            fields: true,
            content: true,
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.catalogEntry.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.catalogEntry.findFirst).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pGetPublishedEntryBySlug tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("entry null - test", async () => {
      prismaMock.catalogEntry.findFirst.mockResolvedValue(null);

      const entrySlug = "entry-slug-1";

      const result =
         await catalogRepository.pGetPublishedEntryBySlug(entrySlug);

      const expectedArgs: CatalogEntryFindFirstArgs = {
         where: {
            slug: entrySlug,
            status: "PUBLISHED",
         },
         include: {
            category: true,
            fields: true,
            content: true,
         },
      };

      expect(result).toBeNull();
      expect(prismaMock.catalogEntry.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.catalogEntry.findFirst).toHaveBeenCalledWith(
         expectedArgs
      );
   });

   it("entry retrieved - test", async () => {
      const entry = ptestData.pCatalogEntryWithContent(1);
      prismaMock.catalogEntry.findFirst.mockResolvedValue(entry);

      const entrySlug = "entry-slug-1";

      const result =
         await catalogRepository.pGetPublishedEntryBySlug(entrySlug);

      const expectedResult = toDCatalogEntryWithContent(entry);

      const expectedArgs: CatalogEntryFindFirstArgs = {
         where: {
            slug: entrySlug,
            status: "PUBLISHED",
         },
         include: {
            category: true,
            fields: true,
            content: true,
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.catalogEntry.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.catalogEntry.findFirst).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pGetCategories tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("categories retrieved - test", async () => {
      const categories = ptestData.pCatalogCategories(3);
      prismaMock.catalogCategory.findMany.mockResolvedValue(categories as any);

      const result = await catalogRepository.pGetCatalogEntryCategories();

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual(toDCatalogCategory(categories[0]));
      expect(prismaMock.catalogCategory.findMany).toHaveBeenCalledWith({
         orderBy: { order: "asc" },
      });
   });
});

describe("pIncrementCopyCount tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("count incremented - test", async () => {
      const catalogEntryId = "entry-id-1";
      await catalogRepository.pIncrementCopyCount(catalogEntryId);

      const expectedArgs: CatalogEntryUpdateArgs = {
         where: { id: catalogEntryId },
         data: {
            copyCount: {
               increment: 1,
            },
         },
      };

      expect(prismaMock.catalogEntry.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.catalogEntry.update).toHaveBeenCalledWith(expectedArgs);
   });
});

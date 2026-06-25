import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { DCatalogEntriesPage } from "@/data/types/domain/catalog";
import {
   CatalogCategoryFindManyArgs,
   CatalogEntryCountArgs,
   CatalogEntryFindFirstArgs,
   CatalogEntryFindManyArgs,
} from "@/generated/prisma/models";

import {
   toDCatalogCategories,
   toDCatalogEntries,
   toDCatalogEntryWithContent,
} from "./catalog.mapper";
import { PublicCatalogRepository } from "./catalog.public.repository";
import { resolveOrderBy, resolveWhereInput } from "./utils";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const catalogRepository = new PublicCatalogRepository(prismaMock);

describe("pGetPublishedEntriesPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
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

describe("pGetPublishedEntryBySlug tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
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

describe("pGetPublishedEntriesSitemapData tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("entries retrieved - test", async () => {
      const rows = [
         { slug: "entry-slug-1", updatedAt: new Date("2025-09-27") },
         { slug: "entry-slug-2", updatedAt: new Date("2025-09-27") },
      ];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prismaMock.catalogEntry.findMany.mockResolvedValue(rows as any);

      const result = await catalogRepository.pGetPublishedEntriesSitemapData();

      const expectedResult = rows.map((r) => ({
         slug: r.slug,
         updatedAt: r.updatedAt.toISOString(),
      }));

      expect(result).toEqual(expectedResult);
      expect(prismaMock.catalogEntry.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.catalogEntry.findMany).toHaveBeenCalledWith({
         where: { status: "PUBLISHED" },
         select: { slug: true, updatedAt: true },
         orderBy: { createdAt: "asc" },
      });
   });

   it("no entries - returns empty array - test", async () => {
      prismaMock.catalogEntry.findMany.mockResolvedValue([]);

      const result = await catalogRepository.pGetPublishedEntriesSitemapData();

      expect(result).toEqual([]);
   });
});

describe("pGetCatalogEntryCategories tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("categories retrieved - test", async () => {
      const categories = ptestData.pCatalogCategories(3);
      prismaMock.catalogCategory.findMany.mockResolvedValue(categories);

      const result = await catalogRepository.pGetCatalogEntryCategories();

      const expectedResult = toDCatalogCategories(categories);

      const expectedArgs: CatalogCategoryFindManyArgs = {
         orderBy: { order: "asc" },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.catalogCategory.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.catalogCategory.findMany).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

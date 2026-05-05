import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { DCatalogEntriesPageQuery } from "@/data/types/domain/catalog";

import {
   toDCatalogCategory,
   toDCatalogEntry,
   toDCatalogEntrySummary,
} from "./catalog.mapper";
import { CatalogRepository } from "./catalog.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const catalogRepository = new CatalogRepository(prismaMock);

describe("pGetPublishedEntriesPage tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pGetPublishedEntriesPage - no query - returns page with defaults - test", async () => {
      const entries = [
         ptestData.pCatalogEntryWithRelations(1),
         ptestData.pCatalogEntryWithRelations(2),
      ];
      prismaMock.catalogEntry.findMany.mockResolvedValue(entries as any);
      prismaMock.catalogEntry.count.mockResolvedValue(2);

      const result = await catalogRepository.pGetPublishedEntriesPage();

      expect(result.content).toHaveLength(2);
      expect(result.pageNumber).toBe(0);
      expect(result.pageSize).toBe(12);
      expect(result.totalElements).toBe(2);
      expect(result.totalPages).toBe(1);
      expect(result.numberOfElements).toBe(2);

      expect(prismaMock.catalogEntry.findMany).toHaveBeenCalledWith(
         expect.objectContaining({
            where: { status: "PUBLISHED" },
            orderBy: { publishedAt: "desc" },
            skip: 0,
            take: 12,
         })
      );
   });

   it("pGetPublishedEntriesPage - with pagination - skips correctly - test", async () => {
      prismaMock.catalogEntry.findMany.mockResolvedValue([]);
      prismaMock.catalogEntry.count.mockResolvedValue(0);

      const query: DCatalogEntriesPageQuery = {
         pagination: { pageNumber: 2, pageSize: 5 },
      };

      await catalogRepository.pGetPublishedEntriesPage(query);

      expect(prismaMock.catalogEntry.findMany).toHaveBeenCalledWith(
         expect.objectContaining({ skip: 10, take: 5 })
      );
   });

   it("pGetPublishedEntriesPage - sort popular - orders by copyCount desc - test", async () => {
      prismaMock.catalogEntry.findMany.mockResolvedValue([]);
      prismaMock.catalogEntry.count.mockResolvedValue(0);

      const query: DCatalogEntriesPageQuery = { sort: "popular" };

      await catalogRepository.pGetPublishedEntriesPage(query);

      expect(prismaMock.catalogEntry.findMany).toHaveBeenCalledWith(
         expect.objectContaining({ orderBy: { copyCount: "desc" } })
      );
   });

   it("pGetPublishedEntriesPage - sort newest - orders by publishedAt desc - test", async () => {
      prismaMock.catalogEntry.findMany.mockResolvedValue([]);
      prismaMock.catalogEntry.count.mockResolvedValue(0);

      const query: DCatalogEntriesPageQuery = { sort: "newest" };

      await catalogRepository.pGetPublishedEntriesPage(query);

      expect(prismaMock.catalogEntry.findMany).toHaveBeenCalledWith(
         expect.objectContaining({ orderBy: { publishedAt: "desc" } })
      );
   });

   it("pGetPublishedEntriesPage - with search filter - includes OR clause - test", async () => {
      prismaMock.catalogEntry.findMany.mockResolvedValue([]);
      prismaMock.catalogEntry.count.mockResolvedValue(0);

      const query: DCatalogEntriesPageQuery = {
         filter: { search: "marketing" },
      };

      await catalogRepository.pGetPublishedEntriesPage(query);

      expect(prismaMock.catalogEntry.findMany).toHaveBeenCalledWith(
         expect.objectContaining({
            where: expect.objectContaining({
               status: "PUBLISHED",
               OR: [
                  { title: { contains: "marketing", mode: "insensitive" } },
                  {
                     description: {
                        contains: "marketing",
                        mode: "insensitive",
                     },
                  },
               ],
            }),
         })
      );
   });

   it("pGetPublishedEntriesPage - with categorySlug filter - filters by category - test", async () => {
      prismaMock.catalogEntry.findMany.mockResolvedValue([]);
      prismaMock.catalogEntry.count.mockResolvedValue(0);

      const query: DCatalogEntriesPageQuery = {
         filter: { categories: "marketing" },
      };

      await catalogRepository.pGetPublishedEntriesPage(query);

      expect(prismaMock.catalogEntry.findMany).toHaveBeenCalledWith(
         expect.objectContaining({
            where: expect.objectContaining({
               status: "PUBLISHED",
               category: { slug: "marketing" },
            }),
         })
      );
   });

   it("pGetPublishedEntriesPage - maps entries to domain summaries - test", async () => {
      const entry = ptestData.pCatalogEntryWithRelations(1);
      prismaMock.catalogEntry.findMany.mockResolvedValue([entry] as any);
      prismaMock.catalogEntry.count.mockResolvedValue(1);

      const result = await catalogRepository.pGetPublishedEntriesPage();

      expect(result.content[0]).toEqual(toDCatalogEntrySummary(entry));
      expect((result.content[0] as any).content).toBeUndefined();
   });
});

describe("pGetPublishedEntryBySlug tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pGetPublishedEntryBySlug - entry found - returns domain entry - test", async () => {
      const entry = ptestData.pCatalogEntryWithRelations(1);
      prismaMock.catalogEntry.findFirst.mockResolvedValue(entry as any);

      const result =
         await catalogRepository.pGetPublishedEntryBySlug("catalog-entry-1");

      expect(result).toEqual(toDCatalogEntry(entry));
      expect(prismaMock.catalogEntry.findFirst).toHaveBeenCalledWith({
         where: { slug: "catalog-entry-1", status: "PUBLISHED" },
         include: { category: true, fields: true },
      });
   });

   it("pGetPublishedEntryBySlug - entry not found - returns null - test", async () => {
      prismaMock.catalogEntry.findFirst.mockResolvedValue(null);

      const result =
         await catalogRepository.pGetPublishedEntryBySlug("non-existent");

      expect(result).toBeNull();
   });

   it("pGetPublishedEntryBySlug - DRAFT entry - filtered out (status PUBLISHED in where) - test", async () => {
      prismaMock.catalogEntry.findFirst.mockResolvedValue(null);

      await catalogRepository.pGetPublishedEntryBySlug("draft-entry");

      expect(prismaMock.catalogEntry.findFirst).toHaveBeenCalledWith(
         expect.objectContaining({
            where: { slug: "draft-entry", status: "PUBLISHED" },
         })
      );
   });
});

describe("pGetPublishedEntryById tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pGetPublishedEntryById - entry found - returns domain entry - test", async () => {
      const entry = ptestData.pCatalogEntryWithRelations(1);
      prismaMock.catalogEntry.findFirst.mockResolvedValue(entry as any);

      const result =
         await catalogRepository.pGetPublishedEntryById("entry-uuid-0001");

      expect(result).toEqual(toDCatalogEntry(entry));
      expect(prismaMock.catalogEntry.findFirst).toHaveBeenCalledWith({
         where: { id: "entry-uuid-0001", status: "PUBLISHED" },
         include: { category: true, fields: true },
      });
   });

   it("pGetPublishedEntryById - entry not found - returns null - test", async () => {
      prismaMock.catalogEntry.findFirst.mockResolvedValue(null);

      const result =
         await catalogRepository.pGetPublishedEntryById("non-existent");

      expect(result).toBeNull();
   });
});

describe("pGetCategories tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pGetCategories - returns all categories ordered by order asc - test", async () => {
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

   it("pIncrementCopyCount - increments copy count for entry - test", async () => {
      const entry = ptestData.pCatalogEntry(1);
      prismaMock.catalogEntry.update.mockResolvedValue(entry as any);

      await catalogRepository.pIncrementCopyCount("entry-uuid-0001");

      expect(prismaMock.catalogEntry.update).toHaveBeenCalledWith({
         where: { id: "entry-uuid-0001" },
         data: { copyCount: { increment: 1 } },
      });
   });
});

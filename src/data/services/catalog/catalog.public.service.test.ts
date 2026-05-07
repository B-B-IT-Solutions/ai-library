jest.mock("@/data/repositories/catalog");

import { dtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import { CatalogRepository } from "@/data/repositories/catalog";
import prisma from "@/data/repositories/prisma";

import { PublicCatalogService } from "./catalog.public.service";

const catalogRepo = new CatalogRepository(prisma);
const catalogRepoMock = catalogRepo as DeepMockProxy<CatalogRepository>;

const catalogService = new PublicCatalogService(catalogRepoMock);

describe("getPublishedEntriesPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("entries retrieved - test", async () => {
      const page = dtestData.dCatalogEntriesPage();
      catalogRepoMock.pGetPublishedEntriesPage.mockResolvedValue(page);

      const query = dtestData.dCatalogEntriesPageQuery();
      const result = await catalogService.getPublishedCatalogEntriesPage(query);

      expect(result).toEqual(page);
      expect(catalogRepoMock.pGetPublishedEntriesPage).toHaveBeenCalledTimes(1);
      expect(catalogRepoMock.pGetPublishedEntriesPage).toHaveBeenCalledWith(
         query
      );
   });
});

describe("getPublishedEntryBySlug tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("entry retrieved - test", async () => {
      const entry = dtestData.dCatalogEntryWithContent();
      catalogRepoMock.pGetPublishedEntryBySlug.mockResolvedValue(entry);

      const slug = "catalog-entry-1";
      const result = await catalogService.getPublishedCatalogEntryBySlug(slug);

      expect(result).toEqual(entry);
      expect(catalogRepoMock.pGetPublishedEntryBySlug).toHaveBeenCalledTimes(1);
      expect(catalogRepoMock.pGetPublishedEntryBySlug).toHaveBeenCalledWith(
         slug
      );
   });
});

describe("getCatalogEntryCategories tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("categories retrieved - test", async () => {
      const categories = dtestData.dCatalogEntryCategories();
      catalogRepoMock.pGetCatalogEntryCategories.mockResolvedValue(categories);

      const result = await catalogService.getCatalogEntryCategories();

      expect(result).toEqual(categories);
      expect(catalogRepoMock.pGetCatalogEntryCategories).toHaveBeenCalledTimes(
         1
      );
   });
});

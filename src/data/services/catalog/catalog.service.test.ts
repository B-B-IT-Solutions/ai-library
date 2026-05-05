jest.mock("@/data/repositories/catalog");
jest.mock("@/data/services/template");

import { dtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import { CatalogRepository } from "@/data/repositories/catalog";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "../service.factory";
import { TemplateService } from "../template";

import { catalogEntryToPromptTemplateUpdate } from "./catalog.mapper";
import { CatalogService } from "./catalog.service";

const catalogRepo = new CatalogRepository(prisma);
const catalogRepoMock = catalogRepo as DeepMockProxy<CatalogRepository>;

const serviceFactory = new ServiceFactory(prisma);
const templateService = serviceFactory.getTemplateService();

const templateServiceMock = templateService as DeepMockProxy<TemplateService>;

const catalogService = new CatalogService(catalogRepoMock, templateServiceMock);

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
      const entry = dtestData.dCatalogEntry();
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

describe("copyCatalogEntryToUserTemplates tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("entry not found - test", async () => {
      catalogRepoMock.pGetPublishedEntryById.mockResolvedValue(null);

      const userId = "user-id-1";
      const entryId = "missing-id-1";
      const fn = () =>
         catalogService.copyCatalogEntryToUserTemplates(entryId, userId);

      await expect(fn).rejects.toThrow();

      expect(catalogRepo.pGetPublishedEntryById).toHaveBeenCalledTimes(1);
      expect(catalogRepo.pGetPublishedEntryById).toHaveBeenCalledWith(entryId);
      expect(
         templateServiceMock.createTemplateDescriptor
      ).not.toHaveBeenCalled();
      expect(catalogRepo.pIncrementCopyCount).not.toHaveBeenCalled();
   });

   it("entry copied - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      catalogRepoMock.pGetPublishedEntryById.mockResolvedValue(entry);

      const descriptor = dtestData.dPromptTemplateDescriptor();
      templateServiceMock.createTemplateDescriptor.mockResolvedValue(
         descriptor
      );
      catalogRepoMock.pIncrementCopyCount.mockResolvedValue();

      const userId = "user-id-1";

      const result = await catalogService.copyCatalogEntryToUserTemplates(
         entry.id,
         userId
      );

      const expectedTemplateData = catalogEntryToPromptTemplateUpdate(entry);

      expect(result).toEqual(descriptor);
      expect(
         templateServiceMock.createTemplateDescriptor
      ).toHaveBeenCalledTimes(1);
      expect(templateServiceMock.createTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         expectedTemplateData
      );
      expect(catalogRepo.pIncrementCopyCount).toHaveBeenCalledTimes(1);
      expect(catalogRepo.pIncrementCopyCount).toHaveBeenCalledWith(entry.id);
   });

   it("pIncrementCopyCount failure - does not ", async () => {
      const entry = dtestData.dCatalogEntry(1);
      const descriptor = dtestData.dPromptTemplateDescriptor();
      catalogRepoMock.pGetPublishedEntryById.mockResolvedValue(entry);
      templateServiceMock.createTemplateDescriptor.mockResolvedValue(
         descriptor
      );
      catalogRepoMock.pIncrementCopyCount.mockRejectedValue(
         new Error("DB error")
      );

      // fire & forget — error is swallowed via .catch(), result is still returned
      const result = await catalogService.copyCatalogEntryToUserTemplates(
         entry.id,
         "user-1"
      );

      // Give the microtask queue a chance to flush the .catch() handler
      await Promise.resolve();

      expect(result).toEqual(descriptor);
      expect(console.error).toHaveBeenCalledWith(
         "Failed to increment copy count:",
         expect.any(Error)
      );
   });
});

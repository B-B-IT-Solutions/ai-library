jest.mock("@/data/repositories/catalog");
jest.mock("@/data/repositories/template");

import { dtestData, ptestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import { CatalogRepository } from "@/data/repositories/catalog";
import prisma from "@/data/repositories/prisma";
import { TemplateRepository } from "@/data/repositories/template";
import { DCatalogEntriesPageQuery } from "@/data/types/domain/catalog";

import { CatalogService } from "./catalog.service";

const catalogRepo = new CatalogRepository(prisma);
const catalogRepoMock = catalogRepo as DeepMockProxy<CatalogRepository>;

const templateRepo = new TemplateRepository(prisma);
const templateRepoMock = templateRepo as DeepMockProxy<TemplateRepository>;

const catalogService = new CatalogService(catalogRepoMock, templateRepoMock);

describe("getPublishedEntriesPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getPublishedEntriesPage - delegates to repo - test", async () => {
      const page = dtestData.dCatalogEntriesPage();
      catalogRepoMock.pGetPublishedEntriesPage.mockResolvedValue(page);

      const query: DCatalogEntriesPageQuery =
         dtestData.dCatalogEntriesPageQuery();
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

   it("getPublishedEntryBySlug - delegates to repo - test", async () => {
      const entry = dtestData.dCatalogEntry();
      catalogRepoMock.pGetPublishedEntryBySlug.mockResolvedValue(entry);

      const result =
         await catalogService.getPublishedCatalogEntryBySlug("catalog-entry-1");

      expect(result).toEqual(entry);
      expect(catalogRepoMock.pGetPublishedEntryBySlug).toHaveBeenCalledTimes(1);
      expect(catalogRepoMock.pGetPublishedEntryBySlug).toHaveBeenCalledWith(
         "catalog-entry-1"
      );
   });

   it("getPublishedEntryBySlug - not found - returns null - test", async () => {
      catalogRepoMock.pGetPublishedEntryBySlug.mockResolvedValue(null);

      const result =
         await catalogService.getPublishedCatalogEntryBySlug("non-existent");

      expect(result).toBeNull();
   });
});

describe("getCategories tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getCategories - delegates to repo - test", async () => {
      const categories = dtestData.dCatalogCategories();
      catalogRepoMock.pGetCategories.mockResolvedValue(categories);

      const result = await catalogService.getCatalogEntryCategories();

      expect(result).toEqual(categories);
      expect(catalogRepoMock.pGetCategories).toHaveBeenCalledTimes(1);
   });
});

describe("copyEntryToUserLibrary tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("copyEntryToUserLibrary - entry not found - throws error - test", async () => {
      catalogRepoMock.pGetPublishedEntryById.mockResolvedValue(null);

      await expect(
         catalogService.copyEntryToUserTemplates("missing-id", "user-1")
      ).rejects.toThrow(
         "CatalogEntry with ID missing-id not found or not published"
      );

      expect(
         templateRepoMock.pCreatePromptTemplateDescriptor
      ).not.toHaveBeenCalled();
   });

   it("copyEntryToUserLibrary - entry found - creates template descriptor - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      const descriptor = dtestData.dPromptTemplateDescriptor();
      catalogRepoMock.pGetPublishedEntryById.mockResolvedValue(entry);
      templateRepoMock.pCreatePromptTemplateDescriptor.mockResolvedValue(
         descriptor
      );
      catalogRepoMock.pIncrementCopyCount.mockResolvedValue(undefined);

      const result = await catalogService.copyEntryToUserTemplates(
         entry.id,
         "user-1"
      );

      expect(result).toEqual(descriptor);
      expect(
         templateRepoMock.pCreatePromptTemplateDescriptor
      ).toHaveBeenCalledTimes(1);
      expect(
         templateRepoMock.pCreatePromptTemplateDescriptor
      ).toHaveBeenCalledWith(
         "user-1",
         expect.objectContaining({
            title: entry.title,
            description: entry.description,
            content: entry.content,
            recommendedModel: entry.recommendedModel,
            categories: entry.category ? [entry.category.name] : [],
            globalFieldIds: [],
         })
      );
   });

   it("copyEntryToUserLibrary - maps fields correctly - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      const descriptor = dtestData.dPromptTemplateDescriptor();
      catalogRepoMock.pGetPublishedEntryById.mockResolvedValue(entry);
      templateRepoMock.pCreatePromptTemplateDescriptor.mockResolvedValue(
         descriptor
      );
      catalogRepoMock.pIncrementCopyCount.mockResolvedValue(undefined);

      await catalogService.copyEntryToUserTemplates(entry.id, "user-1");

      const callArgs =
         templateRepoMock.pCreatePromptTemplateDescriptor.mock.calls[0][1];
      expect(callArgs.fields).toHaveLength(entry.fields.length);
      const firstField = callArgs.fields[0];
      const firstEntryField = entry.fields[0];
      expect(firstField.name).toBe(firstEntryField.name);
      expect(firstField.label).toBe(firstEntryField.label);
      expect(firstField.type).toBe(firstEntryField.type);
      expect(firstField.required).toBe(firstEntryField.required);
      expect(firstField.order).toBe(firstEntryField.order);
      // catalogEntryId should NOT be present on the mapped field
      expect((firstField as any).catalogEntryId).toBeUndefined();
   });

   it("copyEntryToUserLibrary - entry without category - uses empty categories array - test", async () => {
      const entry = { ...dtestData.dCatalogEntry(1), category: null };
      const descriptor = dtestData.dPromptTemplateDescriptor();
      catalogRepoMock.pGetPublishedEntryById.mockResolvedValue(entry);
      templateRepoMock.pCreatePromptTemplateDescriptor.mockResolvedValue(
         descriptor
      );
      catalogRepoMock.pIncrementCopyCount.mockResolvedValue(undefined);

      await catalogService.copyEntryToUserTemplates(entry.id, "user-1");

      const callArgs =
         templateRepoMock.pCreatePromptTemplateDescriptor.mock.calls[0][1];
      expect(callArgs.categories).toEqual([]);
   });

   it("copyEntryToUserLibrary - triggers pIncrementCopyCount fire-and-forget - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      const descriptor = dtestData.dPromptTemplateDescriptor();
      catalogRepoMock.pGetPublishedEntryById.mockResolvedValue(entry);
      templateRepoMock.pCreatePromptTemplateDescriptor.mockResolvedValue(
         descriptor
      );
      catalogRepoMock.pIncrementCopyCount.mockResolvedValue(undefined);

      await catalogService.copyEntryToUserTemplates(entry.id, "user-1");

      // fire & forget — may be called async, but mock resolves immediately
      expect(catalogRepoMock.pIncrementCopyCount).toHaveBeenCalledWith(
         entry.id
      );
   });

   it("copyEntryToUserLibrary - pIncrementCopyCount failure - does not throw - test", async () => {
      jest.spyOn(console, "error").mockImplementation(() => {});

      const entry = dtestData.dCatalogEntry(1);
      const descriptor = dtestData.dPromptTemplateDescriptor();
      catalogRepoMock.pGetPublishedEntryById.mockResolvedValue(entry);
      templateRepoMock.pCreatePromptTemplateDescriptor.mockResolvedValue(
         descriptor
      );
      catalogRepoMock.pIncrementCopyCount.mockRejectedValue(
         new Error("DB error")
      );

      // fire & forget — error is swallowed via .catch(), result is still returned
      const result = await catalogService.copyEntryToUserTemplates(
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

      jest.restoreAllMocks();
   });
});

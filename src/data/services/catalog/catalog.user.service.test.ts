jest.mock("@/data/repositories/catalog");
jest.mock("@/data/services/prompt");

import { dtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import { CatalogRepository } from "@/data/repositories/catalog";
import prisma from "@/data/repositories/prisma";
import { TemplateService } from "../prompt";
import { ServiceFactory } from "../service.factory";

import { toPromptTemplateUpdate } from "./catalog.mapper";
import { CatalogService } from "./catalog.user.service";

const catalogRepo = new CatalogRepository(prisma);
const catalogRepoMock = catalogRepo as DeepMockProxy<CatalogRepository>;

const serviceFactory = new ServiceFactory(prisma);
const templateService = serviceFactory.getPromptService();

const templateServiceMock = templateService as DeepMockProxy<TemplateService>;

const catalogService = new CatalogService(catalogRepoMock, templateServiceMock);

describe("addCatalogEntryToUserTemplates tests", () => {
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
         catalogService.addCatalogEntryToUserTemplates(userId, entryId);

      await expect(fn).rejects.toThrow();

      expect(catalogRepo.pGetPublishedEntryById).toHaveBeenCalledTimes(1);
      expect(catalogRepo.pGetPublishedEntryById).toHaveBeenCalledWith(entryId);
      expect(
         templateServiceMock.createTemplateDescriptor
      ).not.toHaveBeenCalled();
      expect(catalogRepo.pIncrementCopyCount).not.toHaveBeenCalled();
   });

   it("entry copied - test", async () => {
      const entry = dtestData.dCatalogEntryWithContent(1);
      catalogRepoMock.pGetPublishedEntryById.mockResolvedValue(entry);

      const descriptor = dtestData.dPrompt();
      templateServiceMock.createTemplateDescriptor.mockResolvedValue(
         descriptor
      );
      catalogRepoMock.pIncrementCopyCount.mockResolvedValue();

      const userId = "user-id-1";

      const result = await catalogService.addCatalogEntryToUserTemplates(
         userId,
         entry.id
      );

      const expectedTemplateData = toPromptTemplateUpdate(entry);

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
});

describe("incrementCatalogEntryCopyCount tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("error - test ", async () => {
      const entry = dtestData.dCatalogEntry(1);

      const error = new Error("DB error");
      catalogRepoMock.pIncrementCopyCount.mockRejectedValue(error);

      await catalogService.incrementCatalogEntryCopyCount(entry.id);

      expect(catalogRepo.pIncrementCopyCount).toHaveBeenCalledTimes(1);
      expect(catalogRepo.pIncrementCopyCount).toHaveBeenCalledWith(entry.id);
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("success - test", async () => {
      const entry = dtestData.dCatalogEntry(1);

      catalogRepoMock.pIncrementCopyCount.mockResolvedValue();

      await catalogService.incrementCatalogEntryCopyCount(entry.id);

      expect(catalogRepo.pIncrementCopyCount).toHaveBeenCalledTimes(1);
      expect(catalogRepo.pIncrementCopyCount).toHaveBeenCalledWith(entry.id);
   });
});

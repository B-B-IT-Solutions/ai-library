jest.mock("@/data/repositories/catalog");
jest.mock("@/data/services/prompt");

import { dtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import { CatalogRepository } from "@/data/repositories/catalog";
import prisma from "@/data/repositories/prisma";
import { DPromptUpdateCrate } from "@/data/types/domain/prompt";
import { PromptService } from "../prompt";
import { ServiceFactory } from "../service.factory";

import { toPromptUpdate } from "./catalog.mapper";
import { CatalogService } from "./catalog.user.service";

const catalogRepo = new CatalogRepository(prisma);
const catalogRepoMock = catalogRepo as DeepMockProxy<CatalogRepository>;

const serviceFactory = new ServiceFactory(prisma);
const templateService = serviceFactory.getPromptService();

const promptServiceMock = templateService as DeepMockProxy<PromptService>;

const catalogService = new CatalogService(catalogRepoMock, promptServiceMock);

describe("addCatalogEntryToUserPrompts tests", () => {
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
         catalogService.addCatalogEntryToUserPrompts(userId, entryId);

      await expect(fn).rejects.toThrow();

      expect(catalogRepo.pGetPublishedEntryById).toHaveBeenCalledTimes(1);
      expect(catalogRepo.pGetPublishedEntryById).toHaveBeenCalledWith(entryId);
      expect(promptServiceMock.createPrompt).not.toHaveBeenCalled();
      expect(catalogRepo.pIncrementCopyCount).not.toHaveBeenCalled();
   });

   it("entry copied - test", async () => {
      const entry = dtestData.dCatalogEntryWithContent(1);
      catalogRepoMock.pGetPublishedEntryById.mockResolvedValue(entry);

      const descriptor = dtestData.dPrompt();
      promptServiceMock.createPrompt.mockResolvedValue(descriptor);
      catalogRepoMock.pIncrementCopyCount.mockResolvedValue();

      const userId = "user-id-1";

      const result = await catalogService.addCatalogEntryToUserPrompts(
         userId,
         entry.id
      );

      const expectedData = toPromptUpdate(entry);

      const expectedPayload: DPromptUpdateCrate = {
         data: expectedData,
      };

      expect(result).toEqual(descriptor);
      expect(promptServiceMock.createPrompt).toHaveBeenCalledTimes(1);
      expect(promptServiceMock.createPrompt).toHaveBeenCalledWith(
         userId,
         expectedPayload
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

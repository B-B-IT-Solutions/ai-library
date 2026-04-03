jest.mock("@/data/repositories/library");
jest.mock("@/data/services/prompt-template");

import { dtestData, ptestData } from "@tests";
import { forEach } from "es-toolkit/compat";
import { DeepMockProxy } from "jest-mock-extended";

import { LibraryRepository } from "@/data/repositories/library";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { PromptTemplateService } from "@/data/services/prompt-template";

import { LibraryService } from "./library.service";

const serviceFactory = new ServiceFactory(prisma);
const promptTemplateService = serviceFactory.getPromptTemplateService();

const promptTemplateServiceMock =
   promptTemplateService as DeepMockProxy<PromptTemplateService>;

const libraryRepo = new LibraryRepository(prisma);
const libraryRepoMock = libraryRepo as DeepMockProxy<LibraryRepository>;

const libraryService = new LibraryService(
   libraryRepoMock,
   promptTemplateServiceMock
);

describe("createLibraryEntries tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("createLibraryEntries - order.items empty - test", async () => {
      const order = ptestData.pOrderProducts(1, 0);

      await libraryService.createLibraryEntries(order);

      // expect(libraryRepoMock.pCreateLibraryEntries).not.toHaveBeenCalled();
   });

   it("createLibraryEntries - templateIds empty - test", async () => {
      const order = ptestData.pOrderProducts(1, 3);
      forEach(order.items, (item) => {
         item.product.productItems = [];
      });

      await libraryService.createLibraryEntries(order);

      // expect(libraryRepoMock.pCreateLibraryEntries).not.toHaveBeenCalled();
   });
});

describe("getCollections tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getCollections - collections retrieved - test", async () => {
      const userId = "user-id-1";

      await libraryService.getCollections(userId);

      expect(libraryRepoMock.pGetCollections).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetCollections).toHaveBeenCalledWith(userId);
   });
});

describe("createCollection tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("createCollection - collection created - test", async () => {
      const userId = "user-id-1";
      const data = dtestData.dLibraryCollectionUpdate();

      await libraryService.createCollection(userId, data);

      expect(libraryRepoMock.pCreateCollection).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pCreateCollection).toHaveBeenCalledWith(
         userId,
         data
      );
   });
});

describe("updateCollection tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("updateCollection - collection updated - test", async () => {
      const userId = "user-id-1";
      const collectionId = "collection-id-1";
      const data = dtestData.dLibraryCollectionUpdate();

      await libraryService.updateCollection(collectionId, userId, data);

      expect(libraryRepoMock.pUpdateCollection).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pUpdateCollection).toHaveBeenCalledWith(
         collectionId,
         userId,
         data
      );
   });
});

describe("deleteCollection tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("deleteCollection - collection deleted - test", async () => {
      const userId = "user-id-1";
      const collectionId = "collection-id-1";

      await libraryService.deleteCollection(collectionId, userId);

      expect(libraryRepoMock.pDeleteCollection).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pDeleteCollection).toHaveBeenCalledWith(
         collectionId,
         userId
      );
   });
});

describe("getEntryCollectionIds tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getEntryCollectionIds - collectionId retrieved - test", async () => {
      const userId = "user-id-1";
      const entryId = "entry-id-1";
      const collectionIds = dtestData.dLibraryCollectionIds();

      libraryRepoMock.pGetEntryCollectionIds.mockResolvedValue(collectionIds);

      const result = await libraryService.getEntryCollectionIds(
         userId,
         entryId
      );

      expect(result).toEqual(collectionIds);
      expect(libraryRepoMock.pGetEntryCollectionIds).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetEntryCollectionIds).toHaveBeenCalledWith(
         userId,
         entryId
      );
   });
});

describe("updateEntryCollections tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("updateEntryCollections - collection deleted - test", async () => {
      const userId = "user-id-1";
      const entryId = "entry-id-1";
      const collectionIds = dtestData.dLibraryCollectionIds();

      await libraryService.updateEntryCollections(
         userId,
         entryId,
         collectionIds
      );

      expect(libraryRepoMock.pUpdateEntryCollections).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pUpdateEntryCollections).toHaveBeenCalledWith(
         userId,
         entryId,
         collectionIds
      );
   });
});

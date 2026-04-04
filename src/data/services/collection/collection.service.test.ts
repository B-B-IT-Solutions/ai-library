jest.mock("@/data/repositories/collection");
jest.mock("@/data/services/prompt-template");

import { dtestData, ptestData } from "@tests";
import { forEach } from "es-toolkit/compat";
import { DeepMockProxy } from "jest-mock-extended";

import { CollectionRepository } from "@/data/repositories/collection";
import prisma from "@/data/repositories/prisma";

import { CollectionService } from "./collection.service";

const collectionRepo = new CollectionRepository(prisma);
const collectionRepoMock =
   collectionRepo as DeepMockProxy<CollectionRepository>;

const collectionService = new CollectionService(collectionRepoMock);

describe("createLibraryEntries tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("createLibraryEntries - order.items empty - test", async () => {
      const order = ptestData.pOrderProducts(1, 0);

      await collectionService.createLibraryEntries(order);

      // expect(libraryRepoMock.pCreateLibraryEntries).not.toHaveBeenCalled();
   });

   it("createLibraryEntries - templateIds empty - test", async () => {
      const order = ptestData.pOrderProducts(1, 3);
      forEach(order.items, (item) => {
         item.product.productItems = [];
      });

      await collectionService.createLibraryEntries(order);

      // expect(libraryRepoMock.pCreateLibraryEntries).not.toHaveBeenCalled();
   });
});

describe("getCollections tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getCollections - collections retrieved - test", async () => {
      const userId = "user-id-1";

      await collectionService.getCollections(userId);

      expect(collectionRepoMock.pGetCollections).toHaveBeenCalledTimes(1);
      expect(collectionRepoMock.pGetCollections).toHaveBeenCalledWith(userId);
   });
});

describe("createCollection tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("createCollection - collection created - test", async () => {
      const userId = "user-id-1";
      const data = dtestData.dLibraryCollectionUpdate();

      await collectionService.createCollection(userId, data);

      expect(collectionRepoMock.pCreateCollection).toHaveBeenCalledTimes(1);
      expect(collectionRepoMock.pCreateCollection).toHaveBeenCalledWith(
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

      await collectionService.updateCollection(collectionId, userId, data);

      expect(collectionRepoMock.pUpdateCollection).toHaveBeenCalledTimes(1);
      expect(collectionRepoMock.pUpdateCollection).toHaveBeenCalledWith(
         userId,
         collectionId,
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

      await collectionService.deleteCollection(collectionId, userId);

      expect(collectionRepoMock.pDeleteCollection).toHaveBeenCalledTimes(1);
      expect(collectionRepoMock.pDeleteCollection).toHaveBeenCalledWith(
         userId,
         collectionId
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

      collectionRepoMock.pGetEntryCollectionIds.mockResolvedValue(
         collectionIds
      );

      const result = await collectionService.getEntryCollectionIds(
         userId,
         entryId
      );

      expect(result).toEqual(collectionIds);
      expect(collectionRepoMock.pGetEntryCollectionIds).toHaveBeenCalledTimes(
         1
      );
      expect(collectionRepoMock.pGetEntryCollectionIds).toHaveBeenCalledWith(
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

      await collectionService.updateEntryCollections(
         userId,
         entryId,
         collectionIds
      );

      expect(collectionRepoMock.pUpdateEntryCollections).toHaveBeenCalledTimes(
         1
      );
      expect(collectionRepoMock.pUpdateEntryCollections).toHaveBeenCalledWith(
         userId,
         entryId,
         collectionIds
      );
   });
});

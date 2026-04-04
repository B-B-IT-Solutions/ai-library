jest.mock("@/data/repositories/collection");

import { dtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import { CollectionRepository } from "@/data/repositories/collection";
import prisma from "@/data/repositories/prisma";

import { CollectionService } from "./collection.service";

const collectionRepo = new CollectionRepository(prisma);
const collectionRepoMock =
   collectionRepo as DeepMockProxy<CollectionRepository>;

const collectionService = new CollectionService(collectionRepoMock);

describe("getCollections tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getCollections - collections retrieved - test", async () => {
      const userId = "user-id-1";
      const collections = dtestData.dCollections();
      collectionRepoMock.pGetCollections.mockResolvedValue(collections);

      const result = await collectionService.getCollections(userId);

      expect(result).toEqual(collections);
      expect(collectionRepoMock.pGetCollections).toHaveBeenCalledTimes(1);
      expect(collectionRepoMock.pGetCollections).toHaveBeenCalledWith(userId);
   });
});

describe("getCollectionById tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getCollectionById - collection retrieved - test", async () => {
      const userId = "user-id-1";
      const collection = dtestData.dCollection();
      collectionRepoMock.pGetCollectionById.mockResolvedValue(collection);

      const result = await collectionService.getCollectionById(
         userId,
         collection.id
      );

      expect(result).toEqual(collection);
      expect(collectionRepoMock.pGetCollectionById).toHaveBeenCalledTimes(1);
      expect(collectionRepoMock.pGetCollectionById).toHaveBeenCalledWith(
         userId,
         collection.id
      );
   });
});

describe("getCollectionByShareToken tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getCollectionByShareToken - collection retrieved - test", async () => {
      const token = "token-1";
      const collection = dtestData.dCollection();
      collectionRepoMock.pGetCollectionByShareToken.mockResolvedValue(
         collection
      );

      const result = await collectionService.getCollectionByShareToken(token);

      expect(result).toEqual(collection);
      expect(
         collectionRepoMock.pGetCollectionByShareToken
      ).toHaveBeenCalledTimes(1);
      expect(
         collectionRepoMock.pGetCollectionByShareToken
      ).toHaveBeenCalledWith(token);
   });
});

describe("createCollection tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("createCollection - collection created - test", async () => {
      const userId = "user-id-1";
      const collection = dtestData.dCollection();
      collectionRepoMock.pCreateCollection.mockResolvedValue(collection);

      const data = dtestData.dCollectionUpdate();

      const result = await collectionService.createCollection(userId, data);

      expect(result).toEqual(collection);
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
      const collection = dtestData.dCollection();
      collectionRepoMock.pUpdateCollection.mockResolvedValue(collection);

      const data = dtestData.dCollectionUpdate();

      const result = await collectionService.updateCollection(
         userId,
         collection.id,
         data
      );

      expect(result).toEqual(collection);
      expect(collectionRepoMock.pUpdateCollection).toHaveBeenCalledTimes(1);
      expect(collectionRepoMock.pUpdateCollection).toHaveBeenCalledWith(
         userId,
         collection.id,
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
      const collectionIds = dtestData.dCollectionIds();

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
      const collectionIds = dtestData.dCollectionIds();

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

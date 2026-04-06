jest.mock("@/data/repositories/collection");
jest.mock("uuid");

import { ctestData, dtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";
import { v4 as uuidv4 } from "uuid";

import { CollectionRepository } from "@/data/repositories/collection";
import prisma from "@/data/repositories/prisma";

import { CollectionService } from "./collection.service";

const uuidv4Mock = uuidv4 as jest.MockedFunction<typeof uuidv4>;

const collectionRepo = new CollectionRepository(prisma);
const collectionRepoMock =
   collectionRepo as DeepMockProxy<CollectionRepository>;

const collectionService = new CollectionService(collectionRepoMock);

describe("getCollections tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("collections retrieved - test", async () => {
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

   it("collection retrieved - test", async () => {
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

describe("getCollectionByPublicToken tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("collection retrieved - test", async () => {
      const token = "token-1";
      const collection = dtestData.dCollection();
      collectionRepoMock.pGetCollectionByPublicToken.mockResolvedValue(
         collection
      );

      const result = await collectionService.getCollectionByPublicToken(token);

      expect(result).toEqual(collection);
      expect(
         collectionRepoMock.pGetCollectionByPublicToken
      ).toHaveBeenCalledTimes(1);
      expect(
         collectionRepoMock.pGetCollectionByPublicToken
      ).toHaveBeenCalledWith(token);
   });
});

describe("createCollection tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("collection created - test", async () => {
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

   it("collection updated - test", async () => {
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

   it("collection deleted - test", async () => {
      const userId = "user-id-1";
      const collectionId = "collection-id-1";

      await collectionService.deleteCollection(userId, collectionId);

      expect(collectionRepoMock.pDeleteCollection).toHaveBeenCalledTimes(1);
      expect(collectionRepoMock.pDeleteCollection).toHaveBeenCalledWith(
         userId,
         collectionId
      );
   });
});

describe("getCollectionTemplateIds tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("templateIds retrieved - test", async () => {
      const userId = "user-id-1";
      const collectionId = "collection-id-1";
      const templateIds = dtestData.dTemplateCollectionEntryTemplateIds();
      collectionRepoMock.pGetCollectionTemplateIds.mockResolvedValue(
         templateIds
      );

      const result = await collectionService.getCollectionTemplateIds(
         userId,
         collectionId
      );

      expect(result).toEqual(templateIds);
      expect(
         collectionRepoMock.pGetCollectionTemplateIds
      ).toHaveBeenCalledTimes(1);
      expect(collectionRepoMock.pGetCollectionTemplateIds).toHaveBeenCalledWith(
         userId,
         collectionId
      );
   });
});

describe("addTemplateToCollection tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("collection not found - test", async () => {
      const userId = "user-id-1";
      const collectionId = "collection-id-1";
      const descriptorId = "descriptor-id-1";

      collectionRepoMock.pGetCollectionById.mockResolvedValue(null);

      const fn = async () =>
         await collectionService.addTemplateToCollection(
            userId,
            collectionId,
            descriptorId
         );

      expect(fn).rejects.toThrow(Error);
      expect(collectionRepoMock.pGetCollectionById).toHaveBeenCalledTimes(1);
      expect(collectionRepoMock.pGetCollectionById).toHaveBeenCalledWith(
         userId,
         collectionId
      );
      expect(
         collectionRepoMock.pAddTemplateToCollection
      ).not.toHaveBeenCalled();
   });

   it("template added - test", async () => {
      const userId = "user-id-1";
      const descriptorId = "descriptor-id-1";

      const collection = dtestData.dCollection();
      collectionRepoMock.pGetCollectionById.mockResolvedValue(collection);

      await collectionService.addTemplateToCollection(
         userId,
         collection.id,
         descriptorId
      );

      expect(collectionRepoMock.pGetCollectionById).toHaveBeenCalledTimes(1);
      expect(collectionRepoMock.pGetCollectionById).toHaveBeenCalledWith(
         userId,
         collection.id
      );
      expect(collectionRepoMock.pAddTemplateToCollection).toHaveBeenCalledTimes(
         1
      );
      expect(collectionRepoMock.pAddTemplateToCollection).toHaveBeenCalledWith(
         userId,
         collection.id,
         descriptorId
      );
   });
});

describe("removeTemplateFromCollection tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("collection not found - test", async () => {
      const userId = "user-id-1";
      const collectionId = "collection-id-1";
      const descriptorId = "descriptor-id-1";

      collectionRepoMock.pGetCollectionById.mockResolvedValue(null);

      const fn = async () =>
         await collectionService.removeTemplateFromCollection(
            userId,
            collectionId,
            descriptorId
         );

      expect(fn).rejects.toThrow(Error);
      expect(collectionRepoMock.pGetCollectionById).toHaveBeenCalledTimes(1);
      expect(collectionRepoMock.pGetCollectionById).toHaveBeenCalledWith(
         userId,
         collectionId
      );
      expect(
         collectionRepoMock.pRemoveTemplateFromCollection
      ).not.toHaveBeenCalled();
   });

   it("template removed - test", async () => {
      const userId = "user-id-1";
      const descriptorId = "descriptor-id-1";

      const collection = dtestData.dCollection();
      collectionRepoMock.pGetCollectionById.mockResolvedValue(collection);

      await collectionService.removeTemplateFromCollection(
         userId,
         collection.id,
         descriptorId
      );

      expect(collectionRepoMock.pGetCollectionById).toHaveBeenCalledTimes(1);
      expect(collectionRepoMock.pGetCollectionById).toHaveBeenCalledWith(
         userId,
         collection.id
      );
      expect(
         collectionRepoMock.pRemoveTemplateFromCollection
      ).toHaveBeenCalledTimes(1);
      expect(
         collectionRepoMock.pRemoveTemplateFromCollection
      ).toHaveBeenCalledWith(userId, collection.id, descriptorId);
   });
});

describe("setCollectionPublic tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("isPublic true - test", async () => {
      const userId = "user-id-1";
      const collection = dtestData.dCollection();

      const token = ctestData.uuid();
      uuidv4Mock.mockReturnValue(token);
      collectionRepoMock.pSetPublicToken.mockResolvedValue(collection);

      const result = await collectionService.setCollectionPublic(
         userId,
         collection.id,
         true
      );

      expect(result).toEqual(collection);
      expect(uuidv4Mock).toHaveBeenCalledTimes(1);
      expect(collectionRepoMock.pSetPublicToken).toHaveBeenCalledTimes(1);
      expect(collectionRepoMock.pSetPublicToken).toHaveBeenCalledWith(
         userId,
         collection.id,
         token,
         true
      );
   });

   it("isPublic false - test", async () => {
      const userId = "user-id-1";
      const collection = dtestData.dCollection();

      collectionRepoMock.pSetPublicToken.mockResolvedValue(collection);

      const result = await collectionService.setCollectionPublic(
         userId,
         collection.id,
         false
      );

      expect(result).toEqual(collection);
      expect(uuidv4Mock).not.toHaveBeenCalled();
      expect(collectionRepoMock.pSetPublicToken).toHaveBeenCalledTimes(1);
      expect(collectionRepoMock.pSetPublicToken).toHaveBeenCalledWith(
         userId,
         collection.id,
         null,
         false
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

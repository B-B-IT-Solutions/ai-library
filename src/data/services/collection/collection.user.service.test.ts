jest.mock("@/data/repositories/collection");
jest.mock("uuid");

import { ctestData, dtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";
import { v4 as uuidv4 } from "uuid";

import { CollectionRepository } from "@/data/repositories/collection";
import prisma from "@/data/repositories/prisma";

import { CollectionService } from "./collection.user.service";

const uuidv4Mock = uuidv4 as jest.MockedFunction<typeof uuidv4>;

const collectionRepo = new CollectionRepository(prisma);
const collectionRepoMock =
   collectionRepo as DeepMockProxy<CollectionRepository>;

const collectionService = new CollectionService(collectionRepoMock);

describe("getCollectionsPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("collections retrieved - test", async () => {
      const userId = "user-id-1";
      const page = dtestData.dCollectionsPage();
      collectionRepoMock.pGetCollectionsPage.mockResolvedValue(page);

      const query = dtestData.dCollectionsPageQuery();
      const result = await collectionService.getCollectionsPage(userId, query);

      expect(result).toEqual(page);
      expect(collectionRepoMock.pGetCollectionsPage).toHaveBeenCalledTimes(1);
      expect(collectionRepoMock.pGetCollectionsPage).toHaveBeenCalledWith(
         userId,
         query
      );
   });
});

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

describe("getCollectionPreviews tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("collections retrieved - test", async () => {
      const userId = "user-id-1";
      const collections = dtestData.dCollectionPreviews();
      collectionRepoMock.pGetCollectionPreviews.mockResolvedValue(collections);

      const result = await collectionService.getCollectionPreviews(userId);

      expect(result).toEqual(collections);
      expect(collectionRepoMock.pGetCollectionPreviews).toHaveBeenCalledTimes(
         1
      );
      expect(collectionRepoMock.pGetCollectionPreviews).toHaveBeenCalledWith(
         userId
      );
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

describe("getCollectionPreviewById tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("collection retrieved - test", async () => {
      const userId = "user-id-1";
      const collection = dtestData.dCollectionPreview();
      collectionRepoMock.pGetCollectionPreviewById.mockResolvedValue(
         collection
      );

      const result = await collectionService.getCollectionPreviewById(
         userId,
         collection.id
      );

      expect(result).toEqual(collection);
      expect(
         collectionRepoMock.pGetCollectionPreviewById
      ).toHaveBeenCalledTimes(1);
      expect(collectionRepoMock.pGetCollectionPreviewById).toHaveBeenCalledWith(
         userId,
         collection.id
      );
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

describe("getCollectionPromptIds tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("promptIds retrieved - test", async () => {
      const userId = "user-id-1";
      const collectionId = "collection-id-1";
      const promptIds = dtestData.dCollectionPromptIds();
      collectionRepoMock.pGetCollectionPromptIds.mockResolvedValue(promptIds);

      const result = await collectionService.getCollectionPromptIds(
         userId,
         collectionId
      );

      expect(result).toEqual(promptIds);
      expect(collectionRepoMock.pGetCollectionPromptIds).toHaveBeenCalledTimes(
         1
      );
      expect(collectionRepoMock.pGetCollectionPromptIds).toHaveBeenCalledWith(
         userId,
         collectionId
      );
   });
});

describe("addPromptToCollection tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("collection not found - test", async () => {
      const userId = "user-id-1";
      const collectionId = "collection-id-1";
      const promptId = "prompt-id-1";

      collectionRepoMock.pGetCollectionById.mockResolvedValue(null);

      const fn = async () =>
         await collectionService.addPromptToCollection(
            userId,
            collectionId,
            promptId
         );

      expect(fn).rejects.toThrow(Error);
      expect(collectionRepoMock.pGetCollectionById).toHaveBeenCalledTimes(1);
      expect(collectionRepoMock.pGetCollectionById).toHaveBeenCalledWith(
         userId,
         collectionId
      );
      expect(collectionRepoMock.pAddPromptToCollection).not.toHaveBeenCalled();
   });

   it("prompt added - test", async () => {
      const userId = "user-id-1";
      const promptId = "prompt-id-1";

      const collection = dtestData.dCollection();
      collectionRepoMock.pGetCollectionById.mockResolvedValue(collection);

      await collectionService.addPromptToCollection(
         userId,
         collection.id,
         promptId
      );

      expect(collectionRepoMock.pGetCollectionById).toHaveBeenCalledTimes(1);
      expect(collectionRepoMock.pGetCollectionById).toHaveBeenCalledWith(
         userId,
         collection.id
      );
      expect(collectionRepoMock.pAddPromptToCollection).toHaveBeenCalledTimes(
         1
      );
      expect(collectionRepoMock.pAddPromptToCollection).toHaveBeenCalledWith(
         userId,
         collection.id,
         promptId
      );
   });
});

describe("removePromptFromCollection tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("collection not found - test", async () => {
      const userId = "user-id-1";
      const collectionId = "collection-id-1";
      const promptId = "prompt-id-1";

      collectionRepoMock.pGetCollectionById.mockResolvedValue(null);

      const fn = async () =>
         await collectionService.removePromptFromCollection(
            userId,
            collectionId,
            promptId
         );

      expect(fn).rejects.toThrow(Error);
      expect(collectionRepoMock.pGetCollectionById).toHaveBeenCalledTimes(1);
      expect(collectionRepoMock.pGetCollectionById).toHaveBeenCalledWith(
         userId,
         collectionId
      );
      expect(
         collectionRepoMock.pRemovePromptFromCollection
      ).not.toHaveBeenCalled();
   });

   it("prompt removed - test", async () => {
      const userId = "user-id-1";
      const promptId = "descriptor-id-1";

      const collection = dtestData.dCollection();
      collectionRepoMock.pGetCollectionById.mockResolvedValue(collection);

      await collectionService.removePromptFromCollection(
         userId,
         collection.id,
         promptId
      );

      expect(collectionRepoMock.pGetCollectionById).toHaveBeenCalledTimes(1);
      expect(collectionRepoMock.pGetCollectionById).toHaveBeenCalledWith(
         userId,
         collection.id
      );
      expect(
         collectionRepoMock.pRemovePromptFromCollection
      ).toHaveBeenCalledTimes(1);
      expect(
         collectionRepoMock.pRemovePromptFromCollection
      ).toHaveBeenCalledWith(userId, collection.id, promptId);
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
      collectionRepoMock.pSetCollectionPublicToken.mockResolvedValue(
         collection
      );

      const result = await collectionService.setCollectionPublic(
         userId,
         collection.id,
         true
      );

      expect(result).toEqual(collection);
      expect(uuidv4Mock).toHaveBeenCalledTimes(1);
      expect(
         collectionRepoMock.pSetCollectionPublicToken
      ).toHaveBeenCalledTimes(1);
      expect(collectionRepoMock.pSetCollectionPublicToken).toHaveBeenCalledWith(
         userId,
         collection.id,
         token,
         true
      );
   });

   it("isPublic false - test", async () => {
      const userId = "user-id-1";
      const collection = dtestData.dCollection();

      collectionRepoMock.pSetCollectionPublicToken.mockResolvedValue(
         collection
      );

      const result = await collectionService.setCollectionPublic(
         userId,
         collection.id,
         false
      );

      expect(result).toEqual(collection);
      expect(uuidv4Mock).not.toHaveBeenCalled();
      expect(
         collectionRepoMock.pSetCollectionPublicToken
      ).toHaveBeenCalledTimes(1);
      expect(collectionRepoMock.pSetCollectionPublicToken).toHaveBeenCalledWith(
         userId,
         collection.id,
         null,
         false
      );
   });
});

describe("getPromptCollectionIds tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("collectionIds retrieved - test", async () => {
      const userId = "user-id-1";
      const entryId = "entry-id-1";
      const collectionIds = dtestData.dCollectionIds();

      collectionRepoMock.pGetPromptCollectionIds.mockResolvedValue(
         collectionIds
      );

      const result = await collectionService.getPromptCollectionIds(
         userId,
         entryId
      );

      expect(result).toEqual(collectionIds);
      expect(collectionRepoMock.pGetPromptCollectionIds).toHaveBeenCalledTimes(
         1
      );
      expect(collectionRepoMock.pGetPromptCollectionIds).toHaveBeenCalledWith(
         userId,
         entryId
      );
   });
});

describe("updatePromptCollections tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("collections updated - test", async () => {
      const userId = "user-id-1";
      const promptId = "prompt-id-1";
      const collectionIds = dtestData.dCollectionIds();

      await collectionService.updatePromptCollections(
         userId,
         promptId,
         collectionIds
      );

      expect(collectionRepoMock.pUpdatePromptCollections).toHaveBeenCalledTimes(
         1
      );
      expect(collectionRepoMock.pUpdatePromptCollections).toHaveBeenCalledWith(
         userId,
         promptId,
         collectionIds
      );
   });
});

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

describe("downloadPromptTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("downloadPromptTemplate - template not found - test", async () => {
      const userId = "user-id-1";
      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";
      promptTemplateServiceMock.getTemplateDescriptor.mockResolvedValue(null);

      const fn = async () =>
         await libraryService.downloadPromptTemplate(userId, descriptorId);

      await expect(fn).rejects.toThrow("Template not found");
      expect(
         promptTemplateServiceMock.getTemplateDescriptor
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateServiceMock.getTemplateDescriptor
      ).toHaveBeenCalledWith(userId, descriptorId);
   });

   it("downloadPromptTemplate - template downloaded - test", async () => {
      const userId = "user-id-1";
      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();
      promptTemplateServiceMock.getTemplateDescriptor.mockResolvedValue(
         descriptor
      );

      const result = await libraryService.downloadPromptTemplate(
         userId,
         descriptor.id
      );

      const expectedDownloadData = JSON.stringify(
         {
            title: descriptor.title,
            content: descriptor.promptTemplate.content,
            categories: descriptor.categories.map((c) => c.name),
            recommendedModel: descriptor.recommendedModel,
         },
         null,
         2
      );

      expect(result).toEqual(expectedDownloadData);
      expect(
         promptTemplateServiceMock.getTemplateDescriptor
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateServiceMock.getTemplateDescriptor
      ).toHaveBeenCalledWith(userId, descriptor.id);
   });
});

describe("getLibraryCategories tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getLibraryCategories - categories retrieved - test", async () => {
      const userId = "user-id-1";
      const categories = dtestData.dTemplateCategories();
      promptTemplateServiceMock.getTemplateCategories.mockResolvedValue(
         categories
      );

      const result = await libraryService.getLibraryCategories(userId);

      expect(result).toEqual(categories);
      expect(
         promptTemplateServiceMock.getTemplateCategories
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateServiceMock.getTemplateCategories
      ).toHaveBeenCalledWith(userId);
   });
});

describe("getLibraryModels tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getLibraryModels - models retrieved - test", async () => {
      const userId = "user-id-1";
      const models = dtestData.dTemplateModels();
      promptTemplateServiceMock.getTemplateModles.mockResolvedValue(models);

      const result = await libraryService.getLibraryModels(userId);

      expect(result).toEqual(models);
      expect(promptTemplateServiceMock.getTemplateModles).toHaveBeenCalledTimes(
         1
      );
      expect(promptTemplateServiceMock.getTemplateModles).toHaveBeenCalledWith(
         userId
      );
   });
});

describe("toggleFavorite tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("toggleFavorite - value toggled - test", async () => {
      const userId = "user-id-1";
      const descriptorId = "descriptor-id-1";
      const isFavorite = true;

      await libraryService.toggleFavorite(descriptorId, userId, isFavorite);

      expect(promptTemplateServiceMock.toggleFavorite).toHaveBeenCalledTimes(1);
      expect(promptTemplateServiceMock.toggleFavorite).toHaveBeenCalledWith(
         userId,
         descriptorId,
         isFavorite
      );
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

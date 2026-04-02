jest.mock("@/data/repositories/library");
jest.mock("@/data/services/prompt-template");

import { dtestData, ptestData } from "@tests";
import { forEach, map } from "es-toolkit/compat";
import { DeepMockProxy } from "jest-mock-extended";

import {
   GetLibraryEntryParams,
   LibraryRepository,
} from "@/data/repositories/library";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { PromptTemplateService } from "@/data/services/prompt-template";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import { DPromptTemplateFieldValues } from "@/data/types/domain/prompt.template";

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

describe("getLibraryEntriesPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getLibraryEntriesPage - entries retrieved - test", async () => {
      const userId = "user-id-1";
      const page = dtestData.dTemplateDescriptorsPage();
      const query = dtestData.dTemplateDescriptorsPageQuery();
      promptTemplateServiceMock.getTemplateDescriptorsPage.mockResolvedValue(
         page
      );

      const result = await libraryService.getLibraryEntriesPage(userId, query);

      expect(result).toEqual(page);
      expect(
         promptTemplateServiceMock.getTemplateDescriptorsPage
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateServiceMock.getTemplateDescriptorsPage
      ).toHaveBeenCalledWith(userId, query);
   });
});

describe("getLibraryEntry tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getLibraryEntry - descriptor retrieved - test", async () => {
      const userId = "user-id-1";
      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();
      promptTemplateServiceMock.getPromptTemplateDescriptorWithTemplate.mockResolvedValue(
         descriptor
      );

      const result = await libraryService.getLibraryEntry(
         userId,
         descriptor.id
      );

      expect(result).toEqual(descriptor);
      expect(
         promptTemplateServiceMock.getPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateServiceMock.getPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledWith(userId, descriptor.id);
   });
});

describe("createLibraryEntry tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("createLibraryEntry - descriptor created - test", async () => {
      const userId = "user-id-1";
      const createData = dtestData.dPromptTemplateUpdate();
      const templateDescriptor = dtestData.dPromptTemplateDescriptor();
      promptTemplateServiceMock.createPromptTemplateDescriptor.mockResolvedValue(
         templateDescriptor
      );

      const result = await libraryService.createLibraryEntry(
         createData,
         userId
      );

      expect(result).toEqual(templateDescriptor);
      expect(
         promptTemplateServiceMock.createPromptTemplateDescriptor
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateServiceMock.createPromptTemplateDescriptor
      ).toHaveBeenCalledWith(userId, createData);
   });
});

describe("createLibraryEntries tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("createLibraryEntries - order.items empty - test", async () => {
      const order = ptestData.pOrderProducts(1, 0);

      await libraryService.createLibraryEntries(order);

      expect(libraryRepoMock.pCreateLibraryEntries).not.toHaveBeenCalled();
   });

   it("createLibraryEntries - templateIds empty - test", async () => {
      const order = ptestData.pOrderProducts(1, 3);
      forEach(order.items, (item) => {
         item.product.productItems = [];
      });

      await libraryService.createLibraryEntries(order);

      expect(libraryRepoMock.pCreateLibraryEntries).not.toHaveBeenCalled();
   });

   it("createLibraryEntries - templateIds saved - test", async () => {
      const order = ptestData.pOrderProducts(1, 3);

      await libraryService.createLibraryEntries(order);

      expect(libraryRepoMock.pCreateLibraryEntries).toHaveBeenCalledTimes(3);

      forEach(order.items, (item, index) => {
         const templateIds = map(
            item.product.productItems,
            (i) => i.templateId
         );
         expect(libraryRepoMock.pCreateLibraryEntries).toHaveBeenNthCalledWith(
            index + 1,
            order.userId,
            templateIds
         );
      });
   });
});

describe("updateLibraryEntry tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("updateLibraryEntry - descriptor not found - test", async () => {
      const userId = "user-id-1";
      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";
      const update = dtestData.dPromptTemplateUpdate();

      promptTemplateServiceMock.getPromptTemplateDescriptorWithTemplate.mockResolvedValue(
         null
      );

      const fn = async () =>
         await libraryService.updateLibraryEntry(userId, descriptorId, update);

      await expect(fn).rejects.toThrow("Library entry not found");
      expect(
         promptTemplateServiceMock.getPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateServiceMock.getPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledWith(userId, descriptorId);
      expect(
         promptTemplateServiceMock.updatePromptTemplateDescriptor
      ).not.toHaveBeenCalled();
   });

   it("updateLibraryEntry - descriptor updated - test", async () => {
      const userId = "user-id-1";
      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();

      const update = dtestData.dPromptTemplateUpdate();

      promptTemplateServiceMock.getPromptTemplateDescriptorWithTemplate.mockResolvedValue(
         descriptor
      );
      promptTemplateServiceMock.updatePromptTemplateDescriptor.mockResolvedValue();

      await libraryService.updateLibraryEntry(userId, descriptor.id, update);

      expect(
         promptTemplateServiceMock.getPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateServiceMock.getPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledWith(userId, descriptor.id);
      expect(
         promptTemplateServiceMock.updatePromptTemplateDescriptor
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateServiceMock.updatePromptTemplateDescriptor
      ).toHaveBeenCalledWith(userId, descriptor.id, update);
   });
});

describe("deleteLibraryEntry tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("deleteLibraryEntry - descriptor not found - test", async () => {
      const userId = "user-id-1";
      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";

      promptTemplateServiceMock.getPromptTemplateDescriptorWithTemplate.mockResolvedValue(
         null
      );

      const fn = async () =>
         await libraryService.deleteLibraryEntry(userId, descriptorId);

      await expect(fn).rejects.toThrow("Library entry not found");
      expect(
         promptTemplateServiceMock.getPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateServiceMock.getPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledWith(userId, descriptorId);
      expect(
         promptTemplateServiceMock.deletePromptTemplateDescriptor
      ).not.toHaveBeenCalled();
   });

   it("deleteLibraryEntry - descriptor deleted - test", async () => {
      const userId = "user-id-1";
      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();

      promptTemplateServiceMock.getPromptTemplateDescriptorWithTemplate.mockResolvedValue(
         descriptor
      );

      await libraryService.deleteLibraryEntry(userId, descriptor.id);

      expect(
         promptTemplateServiceMock.getPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateServiceMock.getPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledWith(userId, descriptor.id);
      expect(
         promptTemplateServiceMock.deletePromptTemplateDescriptor
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateServiceMock.deletePromptTemplateDescriptor
      ).toHaveBeenCalledWith(userId, descriptor.id);
   });
});

describe("deleteLibraryEntries tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("deleteLibraryEntries - entriey deleted - test", async () => {
      const userId = "user-id-1";

      await libraryService.deleteLibraryEntries(userId);

      expect(libraryRepoMock.pDeleteLibraryEntries).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pDeleteLibraryEntries).toHaveBeenCalledWith(
         userId
      );
   });
});

describe("composePromptFromTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("composePromptFromTemplate - template not found - test", async () => {
      const userId = "user-id-1";
      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";
      const fieldValues: DPromptTemplateFieldValues = { field1: "value1" };
      promptTemplateServiceMock.getPromptTemplateDescriptorWithTemplate.mockResolvedValue(
         null
      );

      const fn = async () =>
         await libraryService.composePromptFromTemplate(
            descriptorId,
            fieldValues,
            userId
         );

      await expect(fn).rejects.toThrow("Template not found");
      expect(
         promptTemplateServiceMock.getPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateServiceMock.getPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledWith(userId, descriptorId);
      expect(
         promptTemplateServiceMock.composePromptFromTemplate
      ).not.toHaveBeenCalled();
   });

   it("composePromptFromTemplate - prompt composed - test", async () => {
      const userId = "user-id-1";
      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();
      const fieldValues: DPromptTemplateFieldValues = {
         name: "User-1 Name",
         email: "test1@email.com",
      };
      const expectedPromptUpdate: DPromptUpdate = {
         content: "Hello User-1 Name, your email is test1@email.com",
         title: "Test Prompt",
         recommendedModel: "gpt-4",
         categories: ["test"],
         followUpPrompts: [],
      };

      promptTemplateServiceMock.getPromptTemplateDescriptorWithTemplate.mockResolvedValue(
         descriptor
      );
      promptTemplateServiceMock.composePromptFromTemplate.mockResolvedValue(
         expectedPromptUpdate
      );

      const result = await libraryService.composePromptFromTemplate(
         descriptor.id,
         fieldValues,
         userId
      );

      expect(result).toEqual(expectedPromptUpdate);
      expect(
         promptTemplateServiceMock.getPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateServiceMock.getPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledWith(userId, descriptor.id);
      expect(
         promptTemplateServiceMock.composePromptFromTemplate
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateServiceMock.composePromptFromTemplate
      ).toHaveBeenCalledWith(userId, descriptor.id, fieldValues);
   });
});

describe("downloadPromptTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("downloadPromptTemplate - template not found - test", async () => {
      const userId = "user-id-1";
      const templateDescriptorId = "123e4567-e89b-12d3-a456-426614174000";
      libraryRepoMock.pGetLibraryEntry.mockResolvedValue(null);

      const fn = async () =>
         await libraryService.downloadPromptTemplate(
            templateDescriptorId,
            userId
         );

      const expectedGetEntryPayload: GetLibraryEntryParams = {
         templateDescriptorId,
         userId,
      };

      await expect(fn).rejects.toThrow("Template not found");
      expect(libraryRepoMock.pGetLibraryEntry).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntry).toHaveBeenCalledWith(
         expectedGetEntryPayload
      );
   });

   it("downloadPromptTemplate - template downloaded - test", async () => {
      const userId = "user-id-1";
      const entry = ptestData.pLibraryEntryWithPromptTemplate();
      const templateDescriptorId = entry.templateDescriptorId;
      libraryRepoMock.pGetLibraryEntry.mockResolvedValue(entry);

      const result = await libraryService.downloadPromptTemplate(
         templateDescriptorId,
         userId
      );

      const expectedGetEntryPayload: GetLibraryEntryParams = {
         templateDescriptorId,
         userId,
      };
      const expectedDownloadData = JSON.stringify(
         {
            title: entry.templateDescriptor.title,
            content: entry.templateDescriptor.promptTemplate.content,
            categories: entry.templateDescriptor.categories.map((c) => c.name),
            recommendedModel: entry.templateDescriptor.recommendedModel,
         },
         null,
         2
      );

      expect(result).toEqual(expectedDownloadData);
      expect(libraryRepoMock.pGetLibraryEntry).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntry).toHaveBeenCalledWith(
         expectedGetEntryPayload
      );
   });
});

describe("getLibraryCategories tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getLibraryCategories - categories retrieved - test", async () => {
      const userId = "user-id-1";
      const categories = dtestData.dTemplateCategories();
      libraryRepoMock.pGetLibraryCategories.mockResolvedValue(categories);

      const result = await libraryService.getLibraryCategories(userId);

      expect(result).toEqual(categories);
      expect(libraryRepoMock.pGetLibraryCategories).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryCategories).toHaveBeenCalledWith(
         userId
      );
   });
});

describe("getLibraryModels tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getLibraryModels - models retrieved - test", async () => {
      const userId = "user-id-1";
      const models = dtestData.dTemplateModels();
      libraryRepoMock.pGetLibraryModels.mockResolvedValue(models);

      const result = await libraryService.getLibraryModels(userId);

      expect(result).toEqual(models);
      expect(libraryRepoMock.pGetLibraryModels).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryModels).toHaveBeenCalledWith(userId);
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

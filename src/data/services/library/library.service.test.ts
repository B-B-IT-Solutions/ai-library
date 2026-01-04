jest.mock("@/data/repositories/library");
jest.mock("@/data/services/prompt");
jest.mock("@/data/actions/auth-utils");

import { dtestData, ptestData } from "@tests";
import { forEach, map } from "es-toolkit/compat";
import { DeepMockProxy } from "jest-mock-extended";

import { requireUser } from "@/data/actions/auth-utils";
import {
   GetLibraryEntryParams,
   LibraryRepository,
} from "@/data/repositories/library";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { PromptService } from "@/data/services/prompt";

import {
   toDLibraryEntries,
   toDLibraryEntryWithPromptTemplate,
} from "./library.mapper";
import { LibraryService } from "./library.service";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const serviceFactory = new ServiceFactory(prisma);
const promptService = serviceFactory.getPromptService();

const promptServiceMock = promptService as DeepMockProxy<PromptService>;

const libraryRepo = new LibraryRepository(prisma);
const libraryRepoMock = libraryRepo as DeepMockProxy<LibraryRepository>;

const libraryService = new LibraryService(libraryRepoMock, promptServiceMock);

describe("getLibraryEntries tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getLibraryEntries - user undefined - test", async () => {
      const entries = ptestData.pLibraryEntriesWithTemplateDescriptor();
      requireUserMock.mockRejectedValue("Unknow user");
      libraryRepoMock.pGetLibraryEntries.mockResolvedValue(entries);

      const result = await libraryService.getLibraryEntries();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntries).not.toHaveBeenCalled();
   });

   it("getLibraryEntries - db error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      libraryRepoMock.pGetLibraryEntries.mockRejectedValue("db error");

      const result = await libraryService.getLibraryEntries();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntries).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntries).toHaveBeenCalledWith(user.id);
   });

   it("getLibraryEntries - entries retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      const entries = ptestData.pLibraryEntriesWithTemplateDescriptor();
      requireUserMock.mockResolvedValue(user);
      libraryRepoMock.pGetLibraryEntries.mockResolvedValue(entries);

      const result = await libraryService.getLibraryEntries();

      const expectedResult = toDLibraryEntries(entries);

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntries).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntries).toHaveBeenCalledWith(user.id);
   });
});

describe("getLibraryEntry tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getLibraryEntry - user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);
      const entryId = "entry-id-1";

      const fn = async () => await libraryService.getLibraryEntry(entryId);

      await expect(fn).rejects.toThrow(error);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntry).not.toHaveBeenCalled();
   });

   it("getLibraryEntry - db error - test", async () => {
      const user = dtestData.dLoginUser();
      const error = new Error("Unknow user");
      requireUserMock.mockResolvedValue(user);
      libraryRepoMock.pGetLibraryEntry.mockRejectedValue(error);

      const entryId = "entry-id-1";

      const fn = async () => await libraryService.getLibraryEntry(entryId);

      const expectedGetEntryPayload: GetLibraryEntryParams = {
         entryId,
         userId: user.id,
      };
      await expect(fn).rejects.toThrow(error);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntry).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntry).toHaveBeenCalledWith(
         expectedGetEntryPayload
      );
   });

   it("getLibraryEntry - entry null - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      libraryRepoMock.pGetLibraryEntry.mockResolvedValue(null);

      const entryId = "entry-id-1";

      const result = await libraryService.getLibraryEntry(entryId);

      const expectedGetEntryPayload: GetLibraryEntryParams = {
         entryId,
         userId: user.id,
      };
      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntry).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntry).toHaveBeenCalledWith(
         expectedGetEntryPayload
      );
   });

   it("getLibraryEntry - entry retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      const entry = ptestData.pLibraryEntryWithPromptTemplate();
      requireUserMock.mockResolvedValue(user);
      libraryRepoMock.pGetLibraryEntry.mockResolvedValue(entry);

      const result = await libraryService.getLibraryEntry(entry.id);

      const expectedResult = toDLibraryEntryWithPromptTemplate(entry);
      const expectedGetEntryPayload: GetLibraryEntryParams = {
         entryId: entry.id,
         userId: user.id,
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntry).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntry).toHaveBeenCalledWith(
         expectedGetEntryPayload
      );
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
            order.id,
            order.userId,
            item.product.id,
            templateIds
         );
      });
   });
});

describe("createPromptFromTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("createPromptFromTemplate - invalid UUID - test", async () => {
      const invalidId = "invalid-uuid";

      const fn = async () =>
         await libraryService.createPromptFromTemplate(invalidId);

      await expect(fn).rejects.toThrow("Invalid template ID.");
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(libraryRepoMock.pGetLibraryEntry).not.toHaveBeenCalled();
      expect(promptServiceMock.createPrompt).not.toHaveBeenCalled();
   });

   it("createPromptFromTemplate - user undefined - test", async () => {
      const error = new Error("Unknow user");
      const templateDescriptorId = "123e4567-e89b-12d3-a456-426614174000";
      requireUserMock.mockRejectedValue(error);

      const fn = async () =>
         await libraryService.createPromptFromTemplate(templateDescriptorId);

      await expect(fn).rejects.toThrow(error);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntry).not.toHaveBeenCalled();
      expect(promptServiceMock.createPrompt).not.toHaveBeenCalled();
   });

   it("createPromptFromTemplate - template not found - test", async () => {
      const user = dtestData.dLoginUser();
      const templateDescriptorId = "123e4567-e89b-12d3-a456-426614174000";
      requireUserMock.mockResolvedValue(user);
      libraryRepoMock.pGetLibraryEntry.mockResolvedValue(null);

      const fn = async () =>
         await libraryService.createPromptFromTemplate(templateDescriptorId);

      const expectedGetEntryPayload: GetLibraryEntryParams = {
         templateDescriptorId,
         userId: user.id,
      };

      await expect(fn).rejects.toThrow("Template not found");
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntry).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntry).toHaveBeenCalledWith(
         expectedGetEntryPayload
      );
      expect(promptServiceMock.createPrompt).not.toHaveBeenCalled();
   });

   it("createPromptFromTemplate - prompt created - test", async () => {
      const user = dtestData.dLoginUser();
      const entry = ptestData.pLibraryEntryWithPromptTemplate();
      const templateDescriptorId = entry.templateDescriptorId;
      requireUserMock.mockResolvedValue(user);
      libraryRepoMock.pGetLibraryEntry.mockResolvedValue(entry);

      await libraryService.createPromptFromTemplate(templateDescriptorId);

      const expectedGetEntryPayload: GetLibraryEntryParams = {
         templateDescriptorId,
         userId: user.id,
      };
      const { templateDescriptor } = entry;
      const expectedPromptData = {
         content: templateDescriptor.promptTemplate.promptText,
         title: templateDescriptor.title,
         recommendedModel: templateDescriptor.recommendedModel,
         categories: map(templateDescriptor.categories, (cat) => cat.name),
      };

      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntry).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntry).toHaveBeenCalledWith(
         expectedGetEntryPayload
      );
      expect(promptServiceMock.createPrompt).toHaveBeenCalledTimes(1);
      expect(promptServiceMock.createPrompt).toHaveBeenCalledWith(
         expectedPromptData
      );
   });
});

describe("downloadPromptTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("downloadPromptTemplate - invalid UUID - test", async () => {
      const invalidId = "invalid-uuid";

      const fn = async () =>
         await libraryService.downloadPromptTemplate(invalidId);

      await expect(fn).rejects.toThrow("Invalid template ID.");
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(libraryRepoMock.pGetLibraryEntry).not.toHaveBeenCalled();
   });

   it("downloadPromptTemplate - user undefined - test", async () => {
      const error = new Error("Unknow user");
      const templateDescriptorId = "123e4567-e89b-12d3-a456-426614174000";
      requireUserMock.mockRejectedValue(error);

      const fn = async () =>
         await libraryService.downloadPromptTemplate(templateDescriptorId);

      await expect(fn).rejects.toThrow(error);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntry).not.toHaveBeenCalled();
   });

   it("downloadPromptTemplate - template not found - test", async () => {
      const user = dtestData.dLoginUser();
      const templateDescriptorId = "123e4567-e89b-12d3-a456-426614174000";
      requireUserMock.mockResolvedValue(user);
      libraryRepoMock.pGetLibraryEntry.mockResolvedValue(null);

      const fn = async () =>
         await libraryService.downloadPromptTemplate(templateDescriptorId);

      const expectedGetEntryPayload: GetLibraryEntryParams = {
         templateDescriptorId,
         userId: user.id,
      };

      await expect(fn).rejects.toThrow("Template not found");
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntry).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntry).toHaveBeenCalledWith(
         expectedGetEntryPayload
      );
   });

   it("downloadPromptTemplate - template downloaded - test", async () => {
      const user = dtestData.dLoginUser();
      const entry = ptestData.pLibraryEntryWithPromptTemplate();
      const templateDescriptorId = entry.templateDescriptorId;
      requireUserMock.mockResolvedValue(user);
      libraryRepoMock.pGetLibraryEntry.mockResolvedValue(entry);

      const result = await libraryService.downloadPromptTemplate(
         templateDescriptorId
      );

      const expectedGetEntryPayload: GetLibraryEntryParams = {
         templateDescriptorId,
         userId: user.id,
      };
      const expectedDownloadData = JSON.stringify(
         {
            title: entry.templateDescriptor.title,
            content: entry.templateDescriptor.promptTemplate.promptText,
            categories: entry.templateDescriptor.categories.map((c) => c.name),
            recommendedModel: entry.templateDescriptor.recommendedModel,
         },
         null,
         2
      );

      expect(result).toEqual(expectedDownloadData);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntry).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntry).toHaveBeenCalledWith(
         expectedGetEntryPayload
      );
   });
});

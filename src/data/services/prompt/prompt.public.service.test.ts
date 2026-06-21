jest.mock("@/data/repositories/prompt");
jest.mock("@/data/services/collection");
jest.mock("@/data/services/settings");

import { dtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { PublicPromptRepository } from "@/data/repositories/prompt";
import { DPromptTemplatingData } from "@/data/types/domain/prompt";
import { PublicCollectionService } from "../collection";
import { ServiceFactory } from "../service.factory";
import { PublicSettingsService } from "../settings";

import { PublicPromptService } from "./prompt.public.service";
import { resolveAllTemplateFields } from "./utils";

const serviceFactory = new ServiceFactory(prisma);
const collectionService = serviceFactory.getPublicCollectionService();
const settingsService = serviceFactory.getPublicSettingsService();

const collectionServiceMock =
   collectionService as DeepMockProxy<PublicCollectionService>;

const settingsServiceMock =
   settingsService as DeepMockProxy<PublicSettingsService>;

const promptRepo = new PublicPromptRepository(prisma);
const promptRepoMock = promptRepo as DeepMockProxy<PublicPromptRepository>;

const publicPromptService = new PublicPromptService(
   promptRepoMock,
   collectionServiceMock,
   settingsServiceMock
);

describe("getPublicPromptsPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("filter undefined - test", async () => {
      const query = dtestData.dPromptsPageQuery();
      query.filter = undefined;

      const fn = () => publicPromptService.getPublicPromptsPage(query);

      await expect(fn).rejects.toThrow(Error);
      expect(
         collectionServiceMock.ensureCollectionsPublic
      ).not.toHaveBeenCalled();
      expect(promptRepoMock.pGetPublicPromptsPage).not.toHaveBeenCalled();
   });

   it("filter.collectionIds undefined - test", async () => {
      const query = dtestData.dPromptsPageQuery();
      query.filter!.collectionIds = undefined;

      const fn = () => publicPromptService.getPublicPromptsPage(query);

      await expect(fn).rejects.toThrow(Error);
      expect(
         collectionServiceMock.ensureCollectionsPublic
      ).not.toHaveBeenCalled();
      expect(promptRepoMock.pGetPublicPromptsPage).not.toHaveBeenCalled();
   });

   it("filter.collectionIds empty - test", async () => {
      const query = dtestData.dPromptsPageQuery();
      query.filter!.collectionIds = [];

      const fn = () => publicPromptService.getPublicPromptsPage(query);

      await expect(fn).rejects.toThrow(Error);
      expect(
         collectionServiceMock.ensureCollectionsPublic
      ).not.toHaveBeenCalled();
      expect(promptRepoMock.pGetPublicPromptsPage).not.toHaveBeenCalled();
   });

   it("collection not public - test", async () => {
      collectionServiceMock.ensureCollectionsPublic.mockResolvedValue(false);

      const query = dtestData.dPromptsPageQuery();
      const fn = () => publicPromptService.getPublicPromptsPage(query);

      await expect(fn).rejects.toThrow(Error);
      expect(
         collectionServiceMock.ensureCollectionsPublic
      ).toHaveBeenCalledTimes(1);
      expect(
         collectionServiceMock.ensureCollectionsPublic
      ).toHaveBeenCalledWith(query.filter!.collectionIds);
      expect(promptRepoMock.pGetPublicPromptsPage).not.toHaveBeenCalled();
   });

   it("descriptors retrieved - test", async () => {
      collectionServiceMock.ensureCollectionsPublic.mockResolvedValue(true);

      const page = dtestData.dPromptsPage();
      promptRepoMock.pGetPublicPromptsPage.mockResolvedValue(page);

      const query = dtestData.dPromptsPageQuery();
      const result = await publicPromptService.getPublicPromptsPage(query);

      expect(result).toEqual(page);
      expect(
         collectionServiceMock.ensureCollectionsPublic
      ).toHaveBeenCalledTimes(1);
      expect(
         collectionServiceMock.ensureCollectionsPublic
      ).toHaveBeenCalledWith(query.filter!.collectionIds);
      expect(promptRepoMock.pGetPublicPromptsPage).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPublicPromptsPage).toHaveBeenCalledWith(query);
   });
});

describe("getPublicPromptGenerationData tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("template null - test", async () => {
      promptRepoMock.pGetPublicPromptContent.mockResolvedValue(null);

      const templateId = "template-id-1";
      const result =
         await publicPromptService.getPublicPromptGenerationData(templateId);

      expect(result).toBeNull();
      expect(promptRepoMock.pGetPublicPromptContent).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPublicPromptContent).toHaveBeenCalledWith(
         templateId
      );
      expect(
         settingsServiceMock.getPublicGlobalPromptFieldsByIds
      ).not.toHaveBeenCalled();
   });

   it("data retrieved - test", async () => {
      const template = dtestData.dPromptWithContent();
      promptRepoMock.pGetPublicPromptContent.mockResolvedValue(template);

      const globalFields = dtestData.dGlobalPromptFields();
      settingsServiceMock.getPublicGlobalPromptFieldsByIds.mockResolvedValue(
         globalFields
      );

      const { id, globalFieldIds } = template;
      const result =
         await publicPromptService.getPublicPromptGenerationData(id);

      const allFields = resolveAllTemplateFields(template, globalFields);

      const expectedResult: DPromptTemplatingData = {
         template,
         allFields,
      };

      expect(result).toEqual(expectedResult);
      expect(promptRepoMock.pGetPublicPromptContent).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPublicPromptContent).toHaveBeenCalledWith(id);
      expect(
         settingsServiceMock.getPublicGlobalPromptFieldsByIds
      ).toHaveBeenCalledTimes(1);
      expect(
         settingsServiceMock.getPublicGlobalPromptFieldsByIds
      ).toHaveBeenCalledWith(globalFieldIds);
   });
});

describe("getPublicPrompt tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("prompt retrieved - test", async () => {
      const prompt = dtestData.dPrompt();
      promptRepoMock.pGetPublicPrompt.mockResolvedValue(prompt);

      const { id } = prompt;
      const result = await publicPromptService.getPublicPrompt(id);

      expect(result).toEqual(prompt);
      expect(promptRepoMock.pGetPublicPrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPublicPrompt).toHaveBeenCalledWith(id);
   });
});

describe("getPublicPromptContent tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("promptContent retrieved - test", async () => {
      const template = dtestData.dPromptWithContent();
      promptRepoMock.pGetPublicPromptContent.mockResolvedValue(template);

      const { id } = template;
      const result = await publicPromptService.getPublicPromptContent(id);

      expect(result).toEqual(template);
      expect(promptRepoMock.pGetPublicPromptContent).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPublicPromptContent).toHaveBeenCalledWith(id);
   });
});

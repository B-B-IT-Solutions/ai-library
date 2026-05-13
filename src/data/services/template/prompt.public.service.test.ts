jest.mock("@/data/repositories/template");
jest.mock("@/data/services/collection");
jest.mock("@/data/services/settings");

import { dtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { PublicTemplateRepository } from "@/data/repositories/template";
import { DPromptGenerationData } from "@/data/types/domain/prompt";
import { PublicCollectionService } from "../collection";
import { ServiceFactory } from "../service.factory";
import { PublicSettingsService } from "../settings";

import { PublicTemplateService } from "./prompt.public.service";
import { resolveAllTemplateFields } from "./utils";

const serviceFactory = new ServiceFactory(prisma);
const collectionService = serviceFactory.getPublicCollectionService();
const settingsService = serviceFactory.getPublicSettingsService();

const collectionServiceMock =
   collectionService as DeepMockProxy<PublicCollectionService>;

const settingsServiceMock =
   settingsService as DeepMockProxy<PublicSettingsService>;

const templateRepo = new PublicTemplateRepository(prisma);
const templateRepoMock =
   templateRepo as DeepMockProxy<PublicTemplateRepository>;

const templateService = new PublicTemplateService(
   templateRepoMock,
   collectionServiceMock,
   settingsServiceMock
);

describe("getPublicTemplateDescriptorsPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("filter undefined - test", async () => {
      const query = dtestData.dTemplateDescriptorsPageQuery();
      query.filter = undefined;

      const fn = () => templateService.getPublicTemplateDescriptorsPage(query);

      await expect(fn).rejects.toThrow(Error);
      expect(
         collectionServiceMock.ensureCollectionsPublic
      ).not.toHaveBeenCalled();
      expect(
         templateRepoMock.pGetPublicTemplateDescriptorsPage
      ).not.toHaveBeenCalled();
   });

   it("filter.collectionIds undefined - test", async () => {
      const query = dtestData.dTemplateDescriptorsPageQuery();
      query.filter!.collectionIds = undefined;

      const fn = () => templateService.getPublicTemplateDescriptorsPage(query);

      await expect(fn).rejects.toThrow(Error);
      expect(
         collectionServiceMock.ensureCollectionsPublic
      ).not.toHaveBeenCalled();
      expect(
         templateRepoMock.pGetPublicTemplateDescriptorsPage
      ).not.toHaveBeenCalled();
   });

   it("filter.collectionIds empty - test", async () => {
      const query = dtestData.dTemplateDescriptorsPageQuery();
      query.filter!.collectionIds = [];

      const fn = () => templateService.getPublicTemplateDescriptorsPage(query);

      await expect(fn).rejects.toThrow(Error);
      expect(
         collectionServiceMock.ensureCollectionsPublic
      ).not.toHaveBeenCalled();
      expect(
         templateRepoMock.pGetPublicTemplateDescriptorsPage
      ).not.toHaveBeenCalled();
   });

   it("collection not public - test", async () => {
      collectionServiceMock.ensureCollectionsPublic.mockResolvedValue(false);

      const query = dtestData.dTemplateDescriptorsPageQuery();
      const fn = () => templateService.getPublicTemplateDescriptorsPage(query);

      await expect(fn).rejects.toThrow(Error);
      expect(
         collectionServiceMock.ensureCollectionsPublic
      ).toHaveBeenCalledTimes(1);
      expect(
         collectionServiceMock.ensureCollectionsPublic
      ).toHaveBeenCalledWith(query.filter!.collectionIds);
      expect(
         templateRepoMock.pGetPublicTemplateDescriptorsPage
      ).not.toHaveBeenCalled();
   });

   it("descriptors retrieved - test", async () => {
      collectionServiceMock.ensureCollectionsPublic.mockResolvedValue(true);

      const page = dtestData.dTemplateDescriptorsPage();
      templateRepoMock.pGetPublicTemplateDescriptorsPage.mockResolvedValue(
         page
      );

      const query = dtestData.dTemplateDescriptorsPageQuery();
      const result =
         await templateService.getPublicTemplateDescriptorsPage(query);

      expect(result).toEqual(page);
      expect(
         collectionServiceMock.ensureCollectionsPublic
      ).toHaveBeenCalledTimes(1);
      expect(
         collectionServiceMock.ensureCollectionsPublic
      ).toHaveBeenCalledWith(query.filter!.collectionIds);
      expect(
         templateRepoMock.pGetPublicTemplateDescriptorsPage
      ).toHaveBeenCalledTimes(1);
      expect(
         templateRepoMock.pGetPublicTemplateDescriptorsPage
      ).toHaveBeenCalledWith(query);
   });
});

describe("getPublicTemplateDataForPromptGeneration tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("template null - test", async () => {
      templateRepoMock.pGetPublicPromptTemplate.mockResolvedValue(null);

      const templateId = "template-id-1";
      const result =
         await templateService.getPublicTemplateDataForPromptGeneration(
            templateId
         );

      expect(result).toBeNull();
      expect(templateRepoMock.pGetPublicPromptTemplate).toHaveBeenCalledTimes(
         1
      );
      expect(templateRepoMock.pGetPublicPromptTemplate).toHaveBeenCalledWith(
         templateId
      );
      expect(
         settingsServiceMock.getPublicGlobalPromptFieldsByIds
      ).not.toHaveBeenCalled();
   });

   it("data retrieved - test", async () => {
      const template = dtestData.dPromptTemplate();
      templateRepoMock.pGetPublicPromptTemplate.mockResolvedValue(template);

      const globalFields = dtestData.dGlobalPromptFields();
      settingsServiceMock.getPublicGlobalPromptFieldsByIds.mockResolvedValue(
         globalFields
      );

      const { id, globalFieldIds } = template;
      const result =
         await templateService.getPublicTemplateDataForPromptGeneration(id);

      const allFields = resolveAllTemplateFields(template, globalFields);

      const expectedResult: DPromptGenerationData = {
         template,
         allFields,
      };

      expect(result).toEqual(expectedResult);
      expect(templateRepoMock.pGetPublicPromptTemplate).toHaveBeenCalledTimes(
         1
      );
      expect(templateRepoMock.pGetPublicPromptTemplate).toHaveBeenCalledWith(
         id
      );
      expect(
         settingsServiceMock.getPublicGlobalPromptFieldsByIds
      ).toHaveBeenCalledTimes(1);
      expect(
         settingsServiceMock.getPublicGlobalPromptFieldsByIds
      ).toHaveBeenCalledWith(globalFieldIds);
   });
});

describe("getPublicTemplateDescriptor tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("descriptor retrieved - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptor();
      templateRepoMock.pGetPublicTemplateDescriptor.mockResolvedValue(
         descriptor
      );

      const { id } = descriptor;
      const result = await templateService.getPublicTemplateDescriptor(id);

      expect(result).toEqual(descriptor);
      expect(
         templateRepoMock.pGetPublicTemplateDescriptor
      ).toHaveBeenCalledTimes(1);
      expect(
         templateRepoMock.pGetPublicTemplateDescriptor
      ).toHaveBeenCalledWith(id);
   });
});

describe("getPublicPromptTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("template retrieved - test", async () => {
      const template = dtestData.dPromptTemplate();
      templateRepoMock.pGetPublicPromptTemplate.mockResolvedValue(template);

      const { id } = template;
      const result = await templateService.getPublicPromptTemplate(id);

      expect(result).toEqual(template);
      expect(templateRepoMock.pGetPublicPromptTemplate).toHaveBeenCalledTimes(
         1
      );
      expect(templateRepoMock.pGetPublicPromptTemplate).toHaveBeenCalledWith(
         id
      );
   });
});

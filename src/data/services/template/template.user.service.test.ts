jest.mock("@/data/repositories/template");
jest.mock("@/data/services/settings");
jest.mock("@/lib/template");

import { dtestData, ptestData } from "@tests";
import { map } from "es-toolkit/compat";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { TemplateRepository } from "@/data/repositories/template";
import {
   DPromptFieldValues,
   DPromptGenerationData,
} from "@/data/types/domain/prompt";
import { DPrompt0Update } from "@/data/types/domain/prompt0";
import { FieldsValidationResult, TemplateEngine } from "@/lib/template";
import { ServiceFactory } from "../service.factory";
import { SettingsService } from "../settings";

import { TemplateService } from "./template.user.service";
import { resolveAllTemplateFields } from "./utils";

const serviceFactory = new ServiceFactory(prisma);
const settingsService = serviceFactory.getSettingsService();

const settingsServiceMock = settingsService as DeepMockProxy<SettingsService>;

const templateRepo = new TemplateRepository(prisma);
const templateRepoMock = templateRepo as DeepMockProxy<TemplateRepository>;

const templateService = new TemplateService(
   templateRepoMock,
   settingsServiceMock
);

const sValidate = TemplateEngine.validate;
const sReplace = TemplateEngine.replace;
const sValidateMock = sValidate as jest.MockedFunction<typeof sValidate>;
const sReplaceMock = sReplace as jest.MockedFunction<typeof sReplace>;

describe("getTemplateDescriptorsPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getTemplateDescriptorsPage - descriptors retrieved - test", async () => {
      const userId = "user-id-1";
      const page = dtestData.dTemplateDescriptorsPage();
      const query = dtestData.dTemplateDescriptorsPageQuery();
      templateRepoMock.pGetTemplateDescriptorsPage.mockResolvedValue(page);

      const result = await templateService.getTemplateDescriptorsPage(
         userId,
         query
      );

      expect(result).toEqual(page);
      expect(
         templateRepoMock.pGetTemplateDescriptorsPage
      ).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetTemplateDescriptorsPage).toHaveBeenCalledWith(
         userId,
         query
      );
   });
});

describe("getTemplateDescriptor tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getTemplateDescriptor - descriptor retrieved - test", async () => {
      const userId = "user-id-1";
      const template = dtestData.dPromptTemplateDescriptor();
      templateRepoMock.pGetTemplateDescriptor.mockResolvedValue(template);

      const { id } = template;
      const result = await templateService.getTemplateDescriptor(userId, id);

      expect(result).toEqual(template);
      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         id
      );
   });
});

describe("createTemplateDescriptor tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("createTemplateDescriptor - descriptor created - test", async () => {
      const userId = "user-id-1";
      const newData = dtestData.dPromptTemplateUpdate();
      const newDescriptor = dtestData.dPromptTemplateDescriptor();
      templateRepoMock.pCreatePrompt.mockResolvedValue(newDescriptor);

      const result = await templateService.createTemplateDescriptor(
         userId,
         newData
      );

      expect(result).toEqual(newDescriptor);
      expect(templateRepoMock.pCreatePrompt).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pCreatePrompt).toHaveBeenCalledWith(
         userId,
         newData
      );
   });
});

describe("updateTemplateDescriptor tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("updateTemplateDescriptor - descriptor not found - test", async () => {
      const userId = "user-id-1";
      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";
      const update = dtestData.dPromptTemplateUpdate();

      templateRepoMock.pGetTemplateDescriptor.mockResolvedValue(null);

      const fn = async () =>
         await templateService.updateTemplateDescriptor(
            userId,
            descriptorId,
            update
         );

      await expect(fn).rejects.toThrow("TemplateDescriptor not found");
      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         descriptorId
      );
      expect(templateRepoMock.pUpdatePrompt).not.toHaveBeenCalled();
   });

   it("updateTemplateDescriptor - descriptor updated - test", async () => {
      const userId = "user-id-1";
      const update = dtestData.dPromptTemplateUpdate();
      const descriptor = dtestData.dPromptTemplateDescriptor();

      templateRepoMock.pGetTemplateDescriptor.mockResolvedValue(descriptor);

      await templateService.updateTemplateDescriptor(
         userId,
         descriptor.id,
         update
      );

      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         descriptor.id
      );
      expect(templateRepoMock.pUpdatePrompt).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pUpdatePrompt).toHaveBeenCalledWith(
         userId,
         descriptor.id,
         update
      );
   });
});

describe("deleteTemplateDescriptor tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("deleteTemplateDescriptor - descriptor not found - test", async () => {
      const userId = "user-id-1";
      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";

      templateRepoMock.pGetTemplateDescriptor.mockResolvedValue(null);

      const fn = async () =>
         await templateService.deleteTemplateDescriptor(userId, descriptorId);

      await expect(fn).rejects.toThrow("TemplateDescriptor not found");
      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         descriptorId
      );
      expect(templateRepoMock.pUpdatePrompt).not.toHaveBeenCalled();
   });

   it("deleteTemplateDescriptor - descriptor deleted - test", async () => {
      const userId = "user-id-1";
      const descriptor = dtestData.dPromptTemplateDescriptor();

      templateRepoMock.pGetTemplateDescriptor.mockResolvedValue(descriptor);

      await templateService.deleteTemplateDescriptor(userId, descriptor.id);

      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         descriptor.id
      );
      expect(templateRepoMock.pDeletePrompt).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pDeletePrompt).toHaveBeenCalledWith(
         userId,
         descriptor.id
      );
   });
});

describe("getTemplateDataForPromptGeneration tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getTemplateDataForPromptGeneration - template null - test", async () => {
      const userId = "user-id-1";
      templateRepoMock.pGetPromptTemplate.mockResolvedValue(null);

      const templateId = "template-id-1";
      const result = await templateService.getTemplateDataForPromptGeneration(
         userId,
         templateId
      );

      expect(result).toBeNull();
      expect(templateRepoMock.pGetPromptTemplate).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetPromptTemplate).toHaveBeenCalledWith(
         userId,
         templateId
      );
      expect(
         settingsServiceMock.getGlobalPromptFieldsByIds
      ).not.toHaveBeenCalled();
   });

   it("getTemplateDataForPromptGeneration - data retrieved - test", async () => {
      const userId = "user-id-1";
      const template = dtestData.dPromptTemplate();
      templateRepoMock.pGetPromptTemplate.mockResolvedValue(template);

      const globalFields = dtestData.dGlobalPromptFields();
      settingsServiceMock.getGlobalPromptFieldsByIds.mockResolvedValue(
         globalFields
      );

      const { id, globalFieldIds } = template;
      const result = await templateService.getTemplateDataForPromptGeneration(
         userId,
         id
      );

      const allFields = resolveAllTemplateFields(template, globalFields);

      const expectedResult: DPromptGenerationData = {
         template,
         allFields,
      };

      expect(result).toEqual(expectedResult);
      expect(templateRepoMock.pGetPromptTemplate).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetPromptTemplate).toHaveBeenCalledWith(
         userId,
         id
      );
      expect(
         settingsServiceMock.getGlobalPromptFieldsByIds
      ).toHaveBeenCalledTimes(1);
      expect(
         settingsServiceMock.getGlobalPromptFieldsByIds
      ).toHaveBeenCalledWith(userId, globalFieldIds);
   });
});

describe("composePromptFromTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("descriptor not found - test", async () => {
      templateRepoMock.pGetTemplateDescriptor.mockResolvedValue(null);

      const userId = "user-id-1";
      const id = "non-existent-id";
      const fieldValues: DPromptFieldValues = {};

      const fn = () =>
         templateService.composePromptFromTemplate(userId, id, fieldValues);

      await expect(fn).rejects.toThrow(
         `TemplateDescriptor with ID ${id} not found`
      );

      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         id
      );
      expect(templateRepoMock.pGetPromptTemplate).not.toHaveBeenCalled();
      expect(sValidateMock).not.toHaveBeenCalled();
   });

   it("template not found - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptor();
      templateRepoMock.pGetTemplateDescriptor.mockResolvedValue(descriptor);
      templateRepoMock.pGetPromptTemplate.mockResolvedValue(null);

      const userId = "user-id-1";
      const { id } = descriptor;
      const fieldValues: DPromptFieldValues = {};

      const fn = () =>
         templateService.composePromptFromTemplate(userId, id, fieldValues);

      await expect(fn).rejects.toThrow(`Template with ID ${id} not found`);

      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         id
      );
      expect(templateRepoMock.pGetPromptTemplate).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetPromptTemplate).toHaveBeenCalledWith(
         userId,
         id
      );
      expect(sValidateMock).not.toHaveBeenCalled();
   });

   it("fieldValues invalid - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptor();
      templateRepoMock.pGetTemplateDescriptor.mockResolvedValue(descriptor);

      const template = dtestData.dPromptTemplate();
      templateRepoMock.pGetPromptTemplate.mockResolvedValue(template);

      const validationResult: FieldsValidationResult = {
         valid: false,
         errors: {
            email: "invalid email",
         },
      };
      sValidateMock.mockReturnValue(validationResult);

      const userId = "user-id-1";
      const { id } = descriptor;
      const fieldValues: DPromptFieldValues = {
         email: "invalid-email",
      };

      const fn = () =>
         templateService.composePromptFromTemplate(userId, id, fieldValues);

      await expect(fn).rejects.toThrow("Provided template fields are invalid:");

      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         id
      );
      expect(templateRepoMock.pGetPromptTemplate).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetPromptTemplate).toHaveBeenCalledWith(
         userId,
         id
      );
      expect(sValidateMock).toHaveBeenCalledTimes(1);
      expect(sValidateMock).toHaveBeenCalledWith(template.fields, fieldValues);
   });

   it("composePromptFromTemplate - fieldValues valid - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptor();
      templateRepoMock.pGetTemplateDescriptor.mockResolvedValue(descriptor);

      const template = dtestData.dPromptTemplate();
      templateRepoMock.pGetPromptTemplate.mockResolvedValue(template);

      const validationResult: FieldsValidationResult = {
         valid: true,
         errors: {},
      };
      const promptContent = "Hello, your email is test1@email.com.";
      sValidateMock.mockReturnValue(validationResult);
      sReplaceMock.mockReturnValue(promptContent);

      const userId = "user-id-1";
      const { id } = descriptor;
      const fieldValues: DPromptFieldValues = {
         email: "test1@email.com",
      };

      const result = await templateService.composePromptFromTemplate(
         userId,
         id,
         fieldValues
      );

      const expectedResult: DPrompt0Update = {
         content: promptContent,
         title: descriptor.title,
         recommendedModel: descriptor.recommendedModel,
         categories: descriptor.categories.map((cat) => cat.name),
         followUpPrompts: [],
      };

      expect(result).toEqual(expectedResult);
      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         id
      );
      expect(templateRepoMock.pGetPromptTemplate).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetPromptTemplate).toHaveBeenCalledWith(
         userId,
         id
      );
      expect(sValidateMock).toHaveBeenCalledTimes(1);
      expect(sValidateMock).toHaveBeenCalledWith(template.fields, fieldValues);
      expect(sReplaceMock).toHaveBeenCalledTimes(1);
      expect(sReplaceMock).toHaveBeenCalledWith(template.content, fieldValues);
   });
});

describe("downloadTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("descriptor not found - test", async () => {
      const userId = "user-id-1";
      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";
      templateRepoMock.pGetTemplateDescriptor.mockResolvedValue(null);

      const fn = async () =>
         await templateService.downloadTemplate(userId, descriptorId);

      await expect(fn).rejects.toThrow(
         `TemplateDescriptor with ID ${descriptorId} not found`
      );
      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         descriptorId
      );
      expect(templateRepoMock.pGetPromptTemplate).not.toHaveBeenCalled();
   });

   it("template not found - test", async () => {
      const userId = "user-id-1";

      const descriptor = dtestData.dPromptTemplateDescriptor();
      templateRepoMock.pGetTemplateDescriptor.mockResolvedValue(descriptor);
      templateRepoMock.pGetPromptTemplate.mockResolvedValue(null);

      const { id } = descriptor;

      const fn = async () => await templateService.downloadTemplate(userId, id);

      await expect(fn).rejects.toThrow(`Template with ID ${id} not found`);
      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         id
      );
      expect(templateRepoMock.pGetPromptTemplate).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetPromptTemplate).toHaveBeenCalledWith(
         userId,
         id
      );
   });

   it("template downloaded - test", async () => {
      const userId = "user-id-1";
      const descriptor = dtestData.dPromptTemplateDescriptor();
      templateRepoMock.pGetTemplateDescriptor.mockResolvedValue(descriptor);

      const template = dtestData.dPromptTemplate();
      templateRepoMock.pGetPromptTemplate.mockResolvedValue(template);

      const { id } = descriptor;

      const result = await templateService.downloadTemplate(userId, id);

      const expectedDownloadData = JSON.stringify(
         {
            title: descriptor.title,
            content: template.content,
            categories: descriptor.categories.map((c) => c.name),
            recommendedModel: descriptor.recommendedModel,
         },
         null,
         2
      );

      expect(result).toEqual(expectedDownloadData);
      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         id
      );
      expect(templateRepoMock.pGetPromptTemplate).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetPromptTemplate).toHaveBeenCalledWith(
         userId,
         id
      );
   });
});

describe("toggleTemplateDescriptorFavorite tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("favorite - toggled - test", async () => {
      const userId = "user-id-1";
      const descriptorId = "descriptor-id-1";
      const isFavorite = true;

      await templateService.toggleTemplateDescriptorFavorite(
         userId,
         descriptorId,
         isFavorite
      );

      expect(templateRepoMock.pToggleFavorite).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pToggleFavorite).toHaveBeenCalledWith(
         userId,
         descriptorId,
         isFavorite
      );
   });
});

describe("getPrompts tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getPrompts - params undefined - test", async () => {
      const templates = dtestData.dPromptTemplateDescriptors();
      templateRepoMock.pGetPrompts.mockResolvedValue(templates);

      const result = await templateService.getPrompts();

      expect(result).toEqual(templates);
      expect(templateRepoMock.pGetPrompts).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetPrompts).toHaveBeenCalledWith(undefined);
   });

   it("getPrompts - params empty - test", async () => {
      const templates = dtestData.dPromptTemplateDescriptors();
      templateRepoMock.pGetPrompts.mockResolvedValue(templates);

      const result = await templateService.getPrompts({});

      expect(result).toEqual(templates);
      expect(templateRepoMock.pGetPrompts).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetPrompts).toHaveBeenCalledWith({});
   });

   it("getPrompts - params defined - test", async () => {
      const templates = dtestData.dPromptTemplateDescriptors();
      templateRepoMock.pGetPrompts.mockResolvedValue(templates);

      const search = "prompt 123";
      const categories = ["cat 1", "cat2", "cat 3"];
      const params = { search, categories };

      const result = await templateService.getPrompts(params);

      expect(result).toEqual(templates);
      expect(templateRepoMock.pGetPrompts).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetPrompts).toHaveBeenCalledWith(params);
   });
});

describe("getPromptTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getPromptTemplate - template retrieved - test", async () => {
      const userId = "user-id-1";
      const template = dtestData.dPromptTemplate();
      templateRepoMock.pGetPromptTemplate.mockResolvedValue(template);

      const { id } = template;
      const result = await templateService.getPromptTemplate(userId, id);

      expect(result).toEqual(template);
      expect(templateRepoMock.pGetPromptTemplate).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetPromptTemplate).toHaveBeenCalledWith(
         userId,
         id
      );
   });
});

describe("getPromptTemplateCategories tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getPromptTemplateCategories test", async () => {
      const userId = "user-id-1";
      const categories = ptestData.pPromptTemplateCategories();
      templateRepoMock.pGetPromptTemplateCategories.mockResolvedValue(
         categories
      );

      const result = await templateService.getPromptTemplateCategories(userId);

      const expectedResult = map(categories, (c) => c.name);

      expect(result).toEqual(expectedResult);
      expect(
         templateRepoMock.pGetPromptTemplateCategories
      ).toHaveBeenCalledTimes(1);
      expect(
         templateRepoMock.pGetPromptTemplateCategories
      ).toHaveBeenCalledWith(userId);
   });
});

describe("getTemplateDescriptorCategories tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("categories - retrieved - test", async () => {
      const userId = "user-id-1";

      const categories = dtestData.dTemplateCategories();
      templateRepoMock.pGetTemplateCategories.mockResolvedValue(categories);

      const result =
         await templateService.getTemplateDescriptorCategories(userId);

      expect(result).toEqual(categories);
      expect(templateRepoMock.pGetTemplateCategories).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetTemplateCategories).toHaveBeenCalledWith(
         userId
      );
   });
});

describe("getTemplateDescriptorModels tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("model retrieved - test", async () => {
      const userId = "user-id-1";

      const models = dtestData.dTemplateModels();
      templateRepoMock.pGetTemplateModels.mockResolvedValue(models);

      const result = await templateService.getTemplateDescriptorModels(userId);

      expect(result).toEqual(models);
      expect(templateRepoMock.pGetTemplateModels).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetTemplateModels).toHaveBeenCalledWith(userId);
   });
});

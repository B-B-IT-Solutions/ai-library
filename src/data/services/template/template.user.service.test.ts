jest.mock("@/data/repositories/template");
jest.mock("@/data/services/settings");
jest.mock("@/lib/template");

import { dtestData, ptestData } from "@tests";
import { map } from "es-toolkit/compat";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { TemplateRepository } from "@/data/repositories/template";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import {
   DPromptTemplateDataPromptGeneration,
   DPromptTemplateFieldValues,
} from "@/data/types/domain/prompt.template";
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
      templateRepoMock.pCreatePromptTemplateDescriptor.mockResolvedValue(
         newDescriptor
      );

      const result = await templateService.createTemplateDescriptor(
         userId,
         newData
      );

      expect(result).toEqual(newDescriptor);
      expect(
         templateRepoMock.pCreatePromptTemplateDescriptor
      ).toHaveBeenCalledTimes(1);
      expect(
         templateRepoMock.pCreatePromptTemplateDescriptor
      ).toHaveBeenCalledWith(userId, newData);
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
      expect(
         templateRepoMock.pUpdatePromptTemplateDescriptor
      ).not.toHaveBeenCalled();
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
      expect(
         templateRepoMock.pUpdatePromptTemplateDescriptor
      ).toHaveBeenCalledTimes(1);
      expect(
         templateRepoMock.pUpdatePromptTemplateDescriptor
      ).toHaveBeenCalledWith(userId, descriptor.id, update);
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
      expect(
         templateRepoMock.pUpdatePromptTemplateDescriptor
      ).not.toHaveBeenCalled();
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
      expect(
         templateRepoMock.pDeletePromptTemplateDescriptor
      ).toHaveBeenCalledTimes(1);
      expect(
         templateRepoMock.pDeletePromptTemplateDescriptor
      ).toHaveBeenCalledWith(userId, descriptor.id);
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
         settingsServiceMock.getGlobalTemplateFieldsByIds
      ).not.toHaveBeenCalled();
   });

   it("getTemplateDataForPromptGeneration - data retrieved - test", async () => {
      const userId = "user-id-1";
      const template = dtestData.dPromptTemplate();
      templateRepoMock.pGetPromptTemplate.mockResolvedValue(template);

      const globalFields = dtestData.dGlobalTemplateFields();
      settingsServiceMock.getGlobalTemplateFieldsByIds.mockResolvedValue(
         globalFields
      );

      const { id, globalFieldIds } = template;
      const result = await templateService.getTemplateDataForPromptGeneration(
         userId,
         id
      );

      const allFields = resolveAllTemplateFields(template, globalFields);

      const expectedResult: DPromptTemplateDataPromptGeneration = {
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
         settingsServiceMock.getGlobalTemplateFieldsByIds
      ).toHaveBeenCalledTimes(1);
      expect(
         settingsServiceMock.getGlobalTemplateFieldsByIds
      ).toHaveBeenCalledWith(userId, globalFieldIds);
   });
});

describe("composePromptFromTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("composePromptFromTemplate - descriptor not found - test", async () => {
      templateRepoMock.pGetTemplateDescriptor.mockResolvedValue(null);

      const userId = "user-id-1";
      const id = "non-existent-id";
      const fieldValues: DPromptTemplateFieldValues = {};

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
      expect(sValidateMock).not.toHaveBeenCalled();
   });

   it("composePromptFromTemplate - fieldValues invalid - test", async () => {
      const promptDescriptor = dtestData.dPromptTemplateDescriptor();
      templateRepoMock.pGetTemplateDescriptor.mockResolvedValue(
         promptDescriptor
      );
      const validationResult: FieldsValidationResult = {
         valid: false,
         errors: {
            email: "invalid email",
         },
      };
      sValidateMock.mockReturnValue(validationResult);

      const userId = "user-id-1";
      const { id, promptTemplate } = promptDescriptor;
      const fieldValues: DPromptTemplateFieldValues = {
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
      expect(sValidateMock).toHaveBeenCalledTimes(1);
      expect(sValidateMock).toHaveBeenCalledWith(
         promptTemplate.fields,
         fieldValues
      );
   });

   it("composePromptFromTemplate - fieldValues valid - test", async () => {
      const promptDescriptor = dtestData.dPromptTemplateDescriptor();
      templateRepoMock.pGetTemplateDescriptor.mockResolvedValue(
         promptDescriptor
      );
      const validationResult: FieldsValidationResult = {
         valid: true,
         errors: {},
      };
      const promptContent = "Hello, your email is test1@email.com.";
      sValidateMock.mockReturnValue(validationResult);
      sReplaceMock.mockReturnValue(promptContent);

      const userId = "user-id-1";
      const { id, promptTemplate } = promptDescriptor;
      const fieldValues: DPromptTemplateFieldValues = {
         email: "test1@email.com",
      };

      const result = await templateService.composePromptFromTemplate(
         userId,
         id,
         fieldValues
      );

      const expectedResult: DPromptUpdate = {
         content: promptContent,
         title: promptDescriptor.title,
         recommendedModel: promptDescriptor.recommendedModel,
         categories: promptDescriptor.categories.map((cat) => cat.name),
         followUpPrompts: [],
      };

      expect(result).toEqual(expectedResult);
      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         id
      );
      expect(sValidateMock).toHaveBeenCalledTimes(1);
      expect(sValidateMock).toHaveBeenCalledWith(
         promptTemplate.fields,
         fieldValues
      );
      expect(sReplaceMock).toHaveBeenCalledTimes(1);
      expect(sReplaceMock).toHaveBeenCalledWith(
         promptTemplate.content,
         fieldValues
      );
   });
});

describe("downloadTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("downloadTemplate - template not found - test", async () => {
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
   });

   it("downloadTemplate - template downloaded - test", async () => {
      const userId = "user-id-1";
      const descriptor = dtestData.dPromptTemplateDescriptor();
      templateRepoMock.pGetTemplateDescriptor.mockResolvedValue(descriptor);

      const result = await templateService.downloadTemplate(
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
      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledTimes(1);
      expect(templateRepoMock.pGetTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         descriptor.id
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

describe("getPromptTemplateDescriptors tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getPromptTemplateDescriptors - params undefined - test", async () => {
      const templates = dtestData.dPromptTemplateDescriptors();
      templateRepoMock.pGetPromptTemplateDescriptors.mockResolvedValue(
         templates
      );

      const result = await templateService.getPromptTemplateDescriptors();

      expect(result).toEqual(templates);
      expect(
         templateRepoMock.pGetPromptTemplateDescriptors
      ).toHaveBeenCalledTimes(1);
      expect(
         templateRepoMock.pGetPromptTemplateDescriptors
      ).toHaveBeenCalledWith(undefined);
   });

   it("getPromptTemplateDescriptors - params empty - test", async () => {
      const templates = dtestData.dPromptTemplateDescriptors();
      templateRepoMock.pGetPromptTemplateDescriptors.mockResolvedValue(
         templates
      );

      const result = await templateService.getPromptTemplateDescriptors({});

      expect(result).toEqual(templates);
      expect(
         templateRepoMock.pGetPromptTemplateDescriptors
      ).toHaveBeenCalledTimes(1);
      expect(
         templateRepoMock.pGetPromptTemplateDescriptors
      ).toHaveBeenCalledWith({});
   });

   it("getPromptTemplateDescriptors - params defined - test", async () => {
      const templates = dtestData.dPromptTemplateDescriptors();
      templateRepoMock.pGetPromptTemplateDescriptors.mockResolvedValue(
         templates
      );

      const search = "prompt 123";
      const categories = ["cat 1", "cat2", "cat 3"];
      const params = { search, categories };

      const result = await templateService.getPromptTemplateDescriptors(params);

      expect(result).toEqual(templates);
      expect(
         templateRepoMock.pGetPromptTemplateDescriptors
      ).toHaveBeenCalledTimes(1);
      expect(
         templateRepoMock.pGetPromptTemplateDescriptors
      ).toHaveBeenCalledWith(params);
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

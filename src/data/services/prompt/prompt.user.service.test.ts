jest.mock("@/data/repositories/prompt");
jest.mock("@/data/services/settings");
jest.mock("@/data/services/subscription");
jest.mock("@/lib/template");
jest.mock("@/lib/subscription/server-guards");

import { dtestData, ptestData } from "@tests";
import { map } from "es-toolkit/compat";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { PromptRepository } from "@/data/repositories/prompt";
import {
   DPromptFieldValues,
   DPromptGenerationData,
   DPromptsUsage,
} from "@/data/types/domain/prompt";
import { DPrompt0Update } from "@/data/types/domain/prompt0";
import { DSubscriptionTier } from "@/data/types/domain/subscription";
import { FeatureName } from "@/lib/subscription/access-control";
import { FieldsValidationResult, TemplateEngine } from "@/lib/template";
import { ServiceFactory } from "../service.factory";
import { SettingsService } from "../settings";
import { SubscriptionService } from "../subscription";

import { PromptService } from "./prompt.user.service";
import { resolveAllTemplateFields } from "./utils";

const serviceFactory = new ServiceFactory(prisma);
const settingsService = serviceFactory.getSettingsService();
const subscriptionService = serviceFactory.getSubscriptionService();

const settingsServiceMock = settingsService as DeepMockProxy<SettingsService>;
const subscriptionServiceMock =
   subscriptionService as DeepMockProxy<SubscriptionService>;

const promptRepo = new PromptRepository(prisma);
const promptRepoMock = promptRepo as DeepMockProxy<PromptRepository>;

const promptService = new PromptService(
   promptRepoMock,
   settingsServiceMock,
   subscriptionServiceMock
);

const sValidate = TemplateEngine.validate;
const sReplace = TemplateEngine.replace;
const sValidateMock = sValidate as jest.MockedFunction<typeof sValidate>;
const sReplaceMock = sReplace as jest.MockedFunction<typeof sReplace>;

describe("getPromptsPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("prompts retrieved - test", async () => {
      const userId = "user-id-1";
      const page = dtestData.dPromptsPage();
      const query = dtestData.dPromptsPageQuery();
      promptRepoMock.pGetTemplateDescriptorsPage.mockResolvedValue(page);

      const result = await promptService.getPromptsPage(userId, query);

      expect(result).toEqual(page);
      expect(promptRepoMock.pGetTemplateDescriptorsPage).toHaveBeenCalledTimes(
         1
      );
      expect(promptRepoMock.pGetTemplateDescriptorsPage).toHaveBeenCalledWith(
         userId,
         query
      );
   });
});

describe("getPrompt tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("prompt retrieved - test", async () => {
      const userId = "user-id-1";
      const template = dtestData.dPrompt();
      promptRepoMock.pGetTemplateDescriptor.mockResolvedValue(template);

      const { id } = template;
      const result = await promptService.getPrompt(userId, id);

      expect(result).toEqual(template);
      expect(promptRepoMock.pGetTemplateDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         id
      );
   });
});

describe("createPrompt tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("prompt created - test", async () => {
      const userId = "user-id-1";
      const feature: FeatureName = "maxPrompts";

      const promptsCount = 71;
      promptRepoMock.pGetPromptsCount.mockResolvedValue(promptsCount);

      const newPrompt = dtestData.dPrompt();
      promptRepoMock.pCreatePrompt.mockResolvedValue(newPrompt);

      const newData = dtestData.dPromptUpdate();
      const result = await promptService.createPrompt(userId, newData);

      expect(result).toEqual(newPrompt);
      expect(promptRepoMock.pCreatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pCreatePrompt).toHaveBeenCalledWith(
         userId,
         newData
      );
      expect(promptRepoMock.pGetPromptsCount).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptsCount).toHaveBeenCalledWith(userId);
      expect(subscriptionServiceMock.requireCountLimit).toHaveBeenCalledTimes(
         1
      );
      expect(subscriptionServiceMock.requireCountLimit).toHaveBeenCalledWith(
         userId,
         feature,
         promptsCount
      );
   });
});

describe("updatePrompt tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("prompt not found - test", async () => {
      const userId = "user-id-1";
      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";
      const update = dtestData.dPromptUpdate();

      promptRepoMock.pGetTemplateDescriptor.mockResolvedValue(null);

      const fn = async () =>
         await promptService.updatePrompt(userId, descriptorId, update);

      await expect(fn).rejects.toThrow("TemplateDescriptor not found");
      expect(promptRepoMock.pGetTemplateDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         descriptorId
      );
      expect(promptRepoMock.pUpdatePrompt).not.toHaveBeenCalled();
   });

   it("prompt updated - test", async () => {
      const userId = "user-id-1";
      const update = dtestData.dPromptUpdate();
      const descriptor = dtestData.dPrompt();

      promptRepoMock.pGetTemplateDescriptor.mockResolvedValue(descriptor);

      await promptService.updatePrompt(userId, descriptor.id, update);

      expect(promptRepoMock.pGetTemplateDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         descriptor.id
      );
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledWith(
         userId,
         descriptor.id,
         update
      );
   });
});

describe("deletePrompt tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("prompt not found - test", async () => {
      const userId = "user-id-1";
      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";

      promptRepoMock.pGetTemplateDescriptor.mockResolvedValue(null);

      const fn = async () =>
         await promptService.deletePrompt(userId, descriptorId);

      await expect(fn).rejects.toThrow("TemplateDescriptor not found");
      expect(promptRepoMock.pGetTemplateDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         descriptorId
      );
      expect(promptRepoMock.pUpdatePrompt).not.toHaveBeenCalled();
   });

   it("prompt deleted - test", async () => {
      const userId = "user-id-1";
      const descriptor = dtestData.dPrompt();

      promptRepoMock.pGetTemplateDescriptor.mockResolvedValue(descriptor);

      await promptService.deletePrompt(userId, descriptor.id);

      expect(promptRepoMock.pGetTemplateDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         descriptor.id
      );
      expect(promptRepoMock.pDeletePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pDeletePrompt).toHaveBeenCalledWith(
         userId,
         descriptor.id
      );
   });
});

describe("getPromptGenerationData tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("prompt null - test", async () => {
      const userId = "user-id-1";
      promptRepoMock.pGetPromptTemplate.mockResolvedValue(null);

      const templateId = "template-id-1";
      const result = await promptService.getPromptGenerationData(
         userId,
         templateId
      );

      expect(result).toBeNull();
      expect(promptRepoMock.pGetPromptTemplate).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptTemplate).toHaveBeenCalledWith(
         userId,
         templateId
      );
      expect(
         settingsServiceMock.getGlobalPromptFieldsByIds
      ).not.toHaveBeenCalled();
   });

   it("data retrieved - test", async () => {
      const userId = "user-id-1";
      const template = dtestData.dPromptWithContent();
      promptRepoMock.pGetPromptTemplate.mockResolvedValue(template);

      const globalFields = dtestData.dGlobalPromptFields();
      settingsServiceMock.getGlobalPromptFieldsByIds.mockResolvedValue(
         globalFields
      );

      const { id, globalFieldIds } = template;
      const result = await promptService.getPromptGenerationData(userId, id);

      const allFields = resolveAllTemplateFields(template, globalFields);

      const expectedResult: DPromptGenerationData = {
         template,
         allFields,
      };

      expect(result).toEqual(expectedResult);
      expect(promptRepoMock.pGetPromptTemplate).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptTemplate).toHaveBeenCalledWith(
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
      promptRepoMock.pGetTemplateDescriptor.mockResolvedValue(null);

      const userId = "user-id-1";
      const id = "non-existent-id";
      const fieldValues: DPromptFieldValues = {};

      const fn = () =>
         promptService.composePromptFromTemplate(userId, id, fieldValues);

      await expect(fn).rejects.toThrow(
         `TemplateDescriptor with ID ${id} not found`
      );

      expect(promptRepoMock.pGetTemplateDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         id
      );
      expect(promptRepoMock.pGetPromptTemplate).not.toHaveBeenCalled();
      expect(sValidateMock).not.toHaveBeenCalled();
   });

   it("template not found - test", async () => {
      const descriptor = dtestData.dPrompt();
      promptRepoMock.pGetTemplateDescriptor.mockResolvedValue(descriptor);
      promptRepoMock.pGetPromptTemplate.mockResolvedValue(null);

      const userId = "user-id-1";
      const { id } = descriptor;
      const fieldValues: DPromptFieldValues = {};

      const fn = () =>
         promptService.composePromptFromTemplate(userId, id, fieldValues);

      await expect(fn).rejects.toThrow(`Template with ID ${id} not found`);

      expect(promptRepoMock.pGetTemplateDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         id
      );
      expect(promptRepoMock.pGetPromptTemplate).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptTemplate).toHaveBeenCalledWith(
         userId,
         id
      );
      expect(sValidateMock).not.toHaveBeenCalled();
   });

   it("fieldValues invalid - test", async () => {
      const descriptor = dtestData.dPrompt();
      promptRepoMock.pGetTemplateDescriptor.mockResolvedValue(descriptor);

      const template = dtestData.dPromptWithContent();
      promptRepoMock.pGetPromptTemplate.mockResolvedValue(template);

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
         promptService.composePromptFromTemplate(userId, id, fieldValues);

      await expect(fn).rejects.toThrow("Provided template fields are invalid:");

      expect(promptRepoMock.pGetTemplateDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         id
      );
      expect(promptRepoMock.pGetPromptTemplate).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptTemplate).toHaveBeenCalledWith(
         userId,
         id
      );
      expect(sValidateMock).toHaveBeenCalledTimes(1);
      expect(sValidateMock).toHaveBeenCalledWith(template.fields, fieldValues);
   });

   it("composePromptFromTemplate - fieldValues valid - test", async () => {
      const descriptor = dtestData.dPrompt();
      promptRepoMock.pGetTemplateDescriptor.mockResolvedValue(descriptor);

      const template = dtestData.dPromptWithContent();
      promptRepoMock.pGetPromptTemplate.mockResolvedValue(template);

      const validationResult: FieldsValidationResult = {
         valid: true,
         errors: {},
      };
      const content = "Hello, your email is test1@email.com.";
      sValidateMock.mockReturnValue(validationResult);
      sReplaceMock.mockReturnValue(content);

      const userId = "user-id-1";
      const { id } = descriptor;
      const fieldValues: DPromptFieldValues = {
         email: "test1@email.com",
      };

      const result = await promptService.composePromptFromTemplate(
         userId,
         id,
         fieldValues
      );

      const expectedResult: DPrompt0Update = {
         content: content,
         title: descriptor.title,
         recommendedModel: descriptor.recommendedModel,
         categories: descriptor.categories.map((cat) => cat.name),
         followUpPrompts: [],
      };

      expect(result).toEqual(expectedResult);
      expect(promptRepoMock.pGetTemplateDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         id
      );
      expect(promptRepoMock.pGetPromptTemplate).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptTemplate).toHaveBeenCalledWith(
         userId,
         id
      );
      expect(sValidateMock).toHaveBeenCalledTimes(1);
      expect(sValidateMock).toHaveBeenCalledWith(template.fields, fieldValues);
      expect(sReplaceMock).toHaveBeenCalledTimes(1);
      expect(sReplaceMock).toHaveBeenCalledWith(template.content, fieldValues);
   });
});

describe("downloadPrompt tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("prompt not found - test", async () => {
      const userId = "user-id-1";
      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";
      promptRepoMock.pGetTemplateDescriptor.mockResolvedValue(null);

      const fn = async () =>
         await promptService.downloadPrompt(userId, descriptorId);

      await expect(fn).rejects.toThrow(
         `TemplateDescriptor with ID ${descriptorId} not found`
      );
      expect(promptRepoMock.pGetTemplateDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         descriptorId
      );
      expect(promptRepoMock.pGetPromptTemplate).not.toHaveBeenCalled();
   });

   it("prompt downloaded - test", async () => {
      const userId = "user-id-1";

      const descriptor = dtestData.dPrompt();
      promptRepoMock.pGetTemplateDescriptor.mockResolvedValue(descriptor);
      promptRepoMock.pGetPromptTemplate.mockResolvedValue(null);

      const { id } = descriptor;

      const fn = async () => await promptService.downloadPrompt(userId, id);

      await expect(fn).rejects.toThrow(`Template with ID ${id} not found`);
      expect(promptRepoMock.pGetTemplateDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         id
      );
      expect(promptRepoMock.pGetPromptTemplate).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptTemplate).toHaveBeenCalledWith(
         userId,
         id
      );
   });

   it("template downloaded - test", async () => {
      const userId = "user-id-1";
      const descriptor = dtestData.dPrompt();
      promptRepoMock.pGetTemplateDescriptor.mockResolvedValue(descriptor);

      const template = dtestData.dPromptWithContent();
      promptRepoMock.pGetPromptTemplate.mockResolvedValue(template);

      const { id } = descriptor;

      const result = await promptService.downloadPrompt(userId, id);

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
      expect(promptRepoMock.pGetTemplateDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetTemplateDescriptor).toHaveBeenCalledWith(
         userId,
         id
      );
      expect(promptRepoMock.pGetPromptTemplate).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptTemplate).toHaveBeenCalledWith(
         userId,
         id
      );
   });
});

describe("togglePromptFavorite tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("favorite - toggled - test", async () => {
      const userId = "user-id-1";
      const descriptorId = "descriptor-id-1";
      const isFavorite = true;

      await promptService.togglePromptFavorite(
         userId,
         descriptorId,
         isFavorite
      );

      expect(promptRepoMock.pToggleFavorite).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pToggleFavorite).toHaveBeenCalledWith(
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
      const templates = dtestData.dPrompts();
      promptRepoMock.pGetPrompts.mockResolvedValue(templates);

      const result = await promptService.getPrompts();

      expect(result).toEqual(templates);
      expect(promptRepoMock.pGetPrompts).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPrompts).toHaveBeenCalledWith(undefined);
   });

   it("getPrompts - params empty - test", async () => {
      const templates = dtestData.dPrompts();
      promptRepoMock.pGetPrompts.mockResolvedValue(templates);

      const result = await promptService.getPrompts({});

      expect(result).toEqual(templates);
      expect(promptRepoMock.pGetPrompts).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPrompts).toHaveBeenCalledWith({});
   });

   it("getPrompts - params defined - test", async () => {
      const templates = dtestData.dPrompts();
      promptRepoMock.pGetPrompts.mockResolvedValue(templates);

      const search = "prompt 123";
      const categories = ["cat 1", "cat2", "cat 3"];
      const params = { search, categories };

      const result = await promptService.getPrompts(params);

      expect(result).toEqual(templates);
      expect(promptRepoMock.pGetPrompts).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPrompts).toHaveBeenCalledWith(params);
   });
});

describe("getPromptTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getPromptTemplate - template retrieved - test", async () => {
      const userId = "user-id-1";
      const template = dtestData.dPromptWithContent();
      promptRepoMock.pGetPromptTemplate.mockResolvedValue(template);

      const { id } = template;
      const result = await promptService.getPromptTemplate(userId, id);

      expect(result).toEqual(template);
      expect(promptRepoMock.pGetPromptTemplate).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptTemplate).toHaveBeenCalledWith(
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
      const categories = ptestData.pPromptCategories();
      promptRepoMock.pGetPromptTemplateCategories.mockResolvedValue(categories);

      const result = await promptService.getPromptTemplateCategories(userId);

      const expectedResult = map(categories, (c) => c.name);

      expect(result).toEqual(expectedResult);
      expect(promptRepoMock.pGetPromptTemplateCategories).toHaveBeenCalledTimes(
         1
      );
      expect(promptRepoMock.pGetPromptTemplateCategories).toHaveBeenCalledWith(
         userId
      );
   });
});

describe("getPromptCategories tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("categories - retrieved - test", async () => {
      const userId = "user-id-1";

      const categories = dtestData.dTemplateCategories();
      promptRepoMock.pGetTemplateCategories.mockResolvedValue(categories);

      const result = await promptService.getPromptCategories(userId);

      expect(result).toEqual(categories);
      expect(promptRepoMock.pGetTemplateCategories).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetTemplateCategories).toHaveBeenCalledWith(
         userId
      );
   });
});

describe("getPromptModels tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("model retrieved - test", async () => {
      const userId = "user-id-1";

      const models = dtestData.dTemplateModels();
      promptRepoMock.pGetTemplateModels.mockResolvedValue(models);

      const result = await promptService.getPromptModels(userId);

      expect(result).toEqual(models);
      expect(promptRepoMock.pGetTemplateModels).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetTemplateModels).toHaveBeenCalledWith(userId);
   });
});

describe("getPromptsUsage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("prompts usage retrieved - PRO tier - test", async () => {
      const userId = "user-id-1";
      const promptsCount = 51;
      promptRepoMock.pGetPromptsCount.mockResolvedValue(promptsCount);

      const tier: DSubscriptionTier = "PRO";
      subscriptionServiceMock.getUserTier.mockResolvedValue(tier);

      const result = await promptService.getPromptsUsage(userId);

      const expectedResult: DPromptsUsage = {
         current: promptsCount,
         limit: -1,
      };

      expect(result).toEqual(expectedResult);
      expect(promptRepoMock.pGetPromptsCount).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptsCount).toHaveBeenCalledWith(userId);
      expect(subscriptionServiceMock.getUserTier).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getUserTier).toHaveBeenCalledWith(userId);
   });

   it("prompts usage retrieved - BASIC tier - test", async () => {
      const userId = "user-id-1";
      const promptsCount = 31;

      promptRepoMock.pGetPromptsCount.mockResolvedValue(promptsCount);

      const tier: DSubscriptionTier = "BASIC";
      subscriptionServiceMock.getUserTier.mockResolvedValue(tier);

      const result = await promptService.getPromptsUsage(userId);

      const expectedResult: DPromptsUsage = {
         current: promptsCount,
         limit: 50,
      };

      expect(result).toEqual(expectedResult);
      expect(promptRepoMock.pGetPromptsCount).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptsCount).toHaveBeenCalledWith(userId);
      expect(subscriptionServiceMock.getUserTier).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getUserTier).toHaveBeenCalledWith(userId);
   });

   it("prompts usage retrieved - FREE tier - test", async () => {
      const userId = "user-id-1";
      const promptsCount = 3;

      promptRepoMock.pGetPromptsCount.mockResolvedValue(promptsCount);

      const tier: DSubscriptionTier = "FREE";
      subscriptionServiceMock.getUserTier.mockResolvedValue(tier);

      const result = await promptService.getPromptsUsage(userId);

      const expectedResult: DPromptsUsage = {
         current: promptsCount,
         limit: 5,
      };

      expect(result).toEqual(expectedResult);
      expect(promptRepoMock.pGetPromptsCount).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptsCount).toHaveBeenCalledWith(userId);
      expect(subscriptionServiceMock.getUserTier).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getUserTier).toHaveBeenCalledWith(userId);
   });
});

describe("getPromptsCount tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("count retrieved - test", async () => {
      const userId = "user-id-1";
      const count = 12;
      promptRepoMock.pGetPromptsCount.mockResolvedValue(count);

      const result = await promptService.getPromptsCount(userId);

      expect(result).toBe(count);
      expect(promptRepoMock.pGetPromptsCount).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptsCount).toHaveBeenCalledWith(userId);
   });
});

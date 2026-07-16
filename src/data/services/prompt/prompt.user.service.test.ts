jest.mock("@/data/repositories/prompt");
jest.mock("@/data/services/settings");
jest.mock("@/data/services/subscription");
jest.mock("@/data/services/collection");
jest.mock("@/lib/template");
jest.mock("@/lib/subscription/server-guards");

import { dtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { PromptRepository } from "@/data/repositories/prompt";
import {
   DPromptCategoryWithUsage,
   DPromptsUsage,
   DPromptTemplatingData,
   DPromptVariableValues,
} from "@/data/types/domain/prompt";
import { DPrompt0Update } from "@/data/types/domain/prompt0";
import { DSubscriptionTier } from "@/data/types/domain/subscription";
import { FeatureName } from "@/lib/subscription/access-control";
import { FieldsValidationResult, TemplateEngine } from "@/lib/template";
import { CollectionService } from "../collection";
import { ServiceFactory } from "../service.factory";
import { SettingsService } from "../settings";
import { SubscriptionService } from "../subscription";

import { CategoryNameConflictError } from "./errors";
import { PromptService } from "./prompt.user.service";
import { resolveAllTemplateFields } from "./utils";

const serviceFactory = new ServiceFactory(prisma);
const settingsService = serviceFactory.getSettingsService();
const subscriptionService = serviceFactory.getSubscriptionService();
const collectionService = serviceFactory.getCollectionService();

const settingsServiceMock = settingsService as DeepMockProxy<SettingsService>;
const subscriptionServiceMock =
   subscriptionService as DeepMockProxy<SubscriptionService>;
const collectionServiceMock =
   collectionService as DeepMockProxy<CollectionService>;

const promptRepo = new PromptRepository(prisma);
const promptRepoMock = promptRepo as DeepMockProxy<PromptRepository>;

const promptService = new PromptService(
   promptRepoMock,
   settingsServiceMock,
   subscriptionServiceMock,
   collectionServiceMock
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
      promptRepoMock.pGetPromptsPage.mockResolvedValue(page);

      const result = await promptService.getPromptsPage(userId, query);

      expect(result).toEqual(page);
      expect(promptRepoMock.pGetPromptsPage).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptsPage).toHaveBeenCalledWith(
         userId,
         query
      );
   });
});

describe("getPromptPreviewsPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("prompts retrieved - test", async () => {
      const userId = "user-id-1";
      const page = dtestData.dPromptPreviewsPage();
      const query = dtestData.dPromptPreviewsPageQuery();
      promptRepoMock.pGetPromptPreviewsPage.mockResolvedValue(page);

      const result = await promptService.getPromptPreviewsPage(userId, query);

      expect(result).toEqual(page);
      expect(promptRepoMock.pGetPromptPreviewsPage).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptPreviewsPage).toHaveBeenCalledWith(
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
      promptRepoMock.pGetPrompt.mockResolvedValue(template);

      const { id } = template;
      const result = await promptService.getPrompt(userId, id);

      expect(result).toEqual(template);
      expect(promptRepoMock.pGetPrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPrompt).toHaveBeenCalledWith(userId, id);
   });
});

describe("getPromptWithContent tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("prompt retrieved - test", async () => {
      const userId = "user-id-1";
      const prompt = dtestData.dPromptWithContent();
      promptRepoMock.pGetPromptContent.mockResolvedValue(prompt);

      const { id } = prompt;
      const result = await promptService.getPromptWithContent(userId, id);

      expect(result).toEqual(prompt);
      expect(promptRepoMock.pGetPromptContent).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptContent).toHaveBeenCalledWith(userId, id);
   });
});

describe("createPrompt tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("prompt created - collectionId undefined - test", async () => {
      const userId = "user-id-1";
      const feature: FeatureName = "maxPrompts";

      const promptsCount = 71;
      promptRepoMock.pGetPromptsCount.mockResolvedValue(promptsCount);

      const newPrompt = dtestData.dPrompt();
      promptRepoMock.pCreatePrompt.mockResolvedValue(newPrompt);

      const crate = dtestData.dPromptUpdateCrate();
      crate.collectionId = undefined;

      const result = await promptService.createPrompt(userId, crate);

      expect(result).toEqual(newPrompt);
      expect(promptRepoMock.pCreatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pCreatePrompt).toHaveBeenCalledWith(
         userId,
         crate.data
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
      expect(
         collectionServiceMock.addPromptToCollection
      ).not.toHaveBeenCalled();
   });

   it("prompt created - collectionId defined - test", async () => {
      const userId = "user-id-1";
      const feature: FeatureName = "maxPrompts";

      const promptsCount = 71;
      promptRepoMock.pGetPromptsCount.mockResolvedValue(promptsCount);

      const newPrompt = dtestData.dPrompt();
      promptRepoMock.pCreatePrompt.mockResolvedValue(newPrompt);

      const crate = dtestData.dPromptUpdateCrate();
      const result = await promptService.createPrompt(userId, crate);

      expect(result).toEqual(newPrompt);
      expect(promptRepoMock.pCreatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pCreatePrompt).toHaveBeenCalledWith(
         userId,
         crate.data
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
      expect(collectionServiceMock.addPromptToCollection).toHaveBeenCalledTimes(
         1
      );
      expect(collectionServiceMock.addPromptToCollection).toHaveBeenCalledWith(
         userId,
         crate.collectionId,
         newPrompt.id
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

      promptRepoMock.pGetPrompt.mockResolvedValue(null);

      const fn = async () =>
         await promptService.updatePrompt(userId, descriptorId, update);

      await expect(fn).rejects.toThrow("TemplateDescriptor not found");
      expect(promptRepoMock.pGetPrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPrompt).toHaveBeenCalledWith(
         userId,
         descriptorId
      );
      expect(promptRepoMock.pUpdatePrompt).not.toHaveBeenCalled();
   });

   it("prompt updated - test", async () => {
      const userId = "user-id-1";
      const update = dtestData.dPromptUpdate();
      const descriptor = dtestData.dPrompt();

      promptRepoMock.pGetPrompt.mockResolvedValue(descriptor);

      await promptService.updatePrompt(userId, descriptor.id, update);

      expect(promptRepoMock.pGetPrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPrompt).toHaveBeenCalledWith(
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

      promptRepoMock.pGetPrompt.mockResolvedValue(null);

      const fn = async () =>
         await promptService.deletePrompt(userId, descriptorId);

      await expect(fn).rejects.toThrow("TemplateDescriptor not found");
      expect(promptRepoMock.pGetPrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPrompt).toHaveBeenCalledWith(
         userId,
         descriptorId
      );
      expect(promptRepoMock.pUpdatePrompt).not.toHaveBeenCalled();
   });

   it("prompt deleted - test", async () => {
      const userId = "user-id-1";
      const descriptor = dtestData.dPrompt();

      promptRepoMock.pGetPrompt.mockResolvedValue(descriptor);

      await promptService.deletePrompt(userId, descriptor.id);

      expect(promptRepoMock.pGetPrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPrompt).toHaveBeenCalledWith(
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
      promptRepoMock.pGetPromptContent.mockResolvedValue(null);

      const promptId = "prompt-id-1";
      const result = await promptService.getPromptGenerationData(
         userId,
         promptId
      );

      expect(result).toBeNull();
      expect(promptRepoMock.pGetPromptContent).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptContent).toHaveBeenCalledWith(
         userId,
         promptId
      );
      expect(
         settingsServiceMock.getGlobalPromptFieldsByIds
      ).not.toHaveBeenCalled();
   });

   it("data retrieved - test", async () => {
      const userId = "user-id-1";
      const prompt = dtestData.dPromptWithContent();
      promptRepoMock.pGetPromptContent.mockResolvedValue(prompt);

      const globalFields = dtestData.dGlobalPromptFields();
      settingsServiceMock.getGlobalPromptFieldsByIds.mockResolvedValue(
         globalFields
      );

      const { id, globalFieldIds } = prompt;
      const result = await promptService.getPromptGenerationData(userId, id);

      const allVariables = resolveAllTemplateFields(prompt, globalFields);

      const expectedResult: DPromptTemplatingData = {
         prompt,
         allVariables,
      };

      expect(result).toEqual(expectedResult);
      expect(promptRepoMock.pGetPromptContent).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptContent).toHaveBeenCalledWith(userId, id);
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
      promptRepoMock.pGetPrompt.mockResolvedValue(null);

      const userId = "user-id-1";
      const id = "non-existent-id";
      const fieldValues: DPromptVariableValues = {};

      const fn = () =>
         promptService.composePromptFromTemplate(userId, id, fieldValues);

      await expect(fn).rejects.toThrow(
         `TemplateDescriptor with ID ${id} not found`
      );

      expect(promptRepoMock.pGetPrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPrompt).toHaveBeenCalledWith(userId, id);
      expect(promptRepoMock.pGetPromptContent).not.toHaveBeenCalled();
      expect(sValidateMock).not.toHaveBeenCalled();
   });

   it("template not found - test", async () => {
      const descriptor = dtestData.dPrompt();
      promptRepoMock.pGetPrompt.mockResolvedValue(descriptor);
      promptRepoMock.pGetPromptContent.mockResolvedValue(null);

      const userId = "user-id-1";
      const { id } = descriptor;
      const fieldValues: DPromptVariableValues = {};

      const fn = () =>
         promptService.composePromptFromTemplate(userId, id, fieldValues);

      await expect(fn).rejects.toThrow(`Template with ID ${id} not found`);

      expect(promptRepoMock.pGetPrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPrompt).toHaveBeenCalledWith(userId, id);
      expect(promptRepoMock.pGetPromptContent).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptContent).toHaveBeenCalledWith(userId, id);
      expect(sValidateMock).not.toHaveBeenCalled();
   });

   it("fieldValues invalid - test", async () => {
      const descriptor = dtestData.dPrompt();
      promptRepoMock.pGetPrompt.mockResolvedValue(descriptor);

      const template = dtestData.dPromptWithContent();
      promptRepoMock.pGetPromptContent.mockResolvedValue(template);

      const validationResult: FieldsValidationResult = {
         valid: false,
         errors: {
            email: "invalid email",
         },
      };
      sValidateMock.mockReturnValue(validationResult);

      const userId = "user-id-1";
      const { id } = descriptor;
      const fieldValues: DPromptVariableValues = {
         email: "invalid-email",
      };

      const fn = () =>
         promptService.composePromptFromTemplate(userId, id, fieldValues);

      await expect(fn).rejects.toThrow("Provided template fields are invalid:");

      expect(promptRepoMock.pGetPrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPrompt).toHaveBeenCalledWith(userId, id);
      expect(promptRepoMock.pGetPromptContent).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptContent).toHaveBeenCalledWith(userId, id);
      expect(sValidateMock).toHaveBeenCalledTimes(1);
      expect(sValidateMock).toHaveBeenCalledWith(template.fields, fieldValues);
   });

   it("composePromptFromTemplate - fieldValues valid - test", async () => {
      const descriptor = dtestData.dPrompt();
      promptRepoMock.pGetPrompt.mockResolvedValue(descriptor);

      const template = dtestData.dPromptWithContent();
      promptRepoMock.pGetPromptContent.mockResolvedValue(template);

      const validationResult: FieldsValidationResult = {
         valid: true,
         errors: {},
      };
      const content = "Hello, your email is test1@email.com.";
      sValidateMock.mockReturnValue(validationResult);
      sReplaceMock.mockReturnValue(content);

      const userId = "user-id-1";
      const { id } = descriptor;
      const fieldValues: DPromptVariableValues = {
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
      expect(promptRepoMock.pGetPrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPrompt).toHaveBeenCalledWith(userId, id);
      expect(promptRepoMock.pGetPromptContent).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptContent).toHaveBeenCalledWith(userId, id);
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
      promptRepoMock.pGetPrompt.mockResolvedValue(null);

      const fn = async () =>
         await promptService.downloadPrompt(userId, descriptorId);

      await expect(fn).rejects.toThrow(
         `TemplateDescriptor with ID ${descriptorId} not found`
      );
      expect(promptRepoMock.pGetPrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPrompt).toHaveBeenCalledWith(
         userId,
         descriptorId
      );
      expect(promptRepoMock.pGetPromptContent).not.toHaveBeenCalled();
   });

   it("prompt downloaded - test", async () => {
      const userId = "user-id-1";

      const descriptor = dtestData.dPrompt();
      promptRepoMock.pGetPrompt.mockResolvedValue(descriptor);
      promptRepoMock.pGetPromptContent.mockResolvedValue(null);

      const { id } = descriptor;

      const fn = async () => await promptService.downloadPrompt(userId, id);

      await expect(fn).rejects.toThrow(`Template with ID ${id} not found`);
      expect(promptRepoMock.pGetPrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPrompt).toHaveBeenCalledWith(userId, id);
      expect(promptRepoMock.pGetPromptContent).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptContent).toHaveBeenCalledWith(userId, id);
   });

   it("template downloaded - test", async () => {
      const userId = "user-id-1";
      const descriptor = dtestData.dPrompt();
      promptRepoMock.pGetPrompt.mockResolvedValue(descriptor);

      const template = dtestData.dPromptWithContent();
      promptRepoMock.pGetPromptContent.mockResolvedValue(template);

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
      expect(promptRepoMock.pGetPrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPrompt).toHaveBeenCalledWith(userId, id);
      expect(promptRepoMock.pGetPromptContent).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptContent).toHaveBeenCalledWith(userId, id);
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

describe("getPromptCategoriesPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("categories retrieved - test", async () => {
      const userId = "user-id-1";

      const page = dtestData.dPromptCategoriesPage();
      promptRepoMock.pGetPromptCategoriesPage.mockResolvedValue(page);

      const query = dtestData.dPromptCategoriesPageQuery();
      const result = await promptService.getPromptCategoriesPage(userId, query);

      expect(result).toEqual(page);
      expect(promptRepoMock.pGetPromptCategoriesPage).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptCategoriesPage).toHaveBeenCalledWith(
         userId,
         query
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
      promptRepoMock.pGePromptCategories.mockResolvedValue(categories);

      const result = await promptService.getPromptCategories(userId);

      expect(result).toEqual(categories);
      expect(promptRepoMock.pGePromptCategories).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGePromptCategories).toHaveBeenCalledWith(userId);
   });
});

describe("getPromptModels tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("model retrieved - test", async () => {
      const userId = "user-id-1";

      const models = dtestData.dTemplateModels();
      promptRepoMock.pGetPromptModels.mockResolvedValue(models);

      const result = await promptService.getPromptModels(userId);

      expect(result).toEqual(models);
      expect(promptRepoMock.pGetPromptModels).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptModels).toHaveBeenCalledWith(userId);
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

describe("getCategoriesWithUsage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("categories with usage retrieved - test", async () => {
      const userId = "user-id-1";
      const categories = dtestData.dPromptCategoriesWithUsage();
      promptRepoMock.pGetPromptCategoriesWithUsage.mockResolvedValue(
         categories
      );

      const result = await promptService.getCategoriesWithUsage(userId);

      expect(result).toEqual(categories);
      expect(
         promptRepoMock.pGetPromptCategoriesWithUsage
      ).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptCategoriesWithUsage).toHaveBeenCalledWith(
         userId
      );
   });
});

describe("renameCategory tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("category renamed - no conflict - test", async () => {
      const userId = "user-id-1";
      const categories: DPromptCategoryWithUsage[] = [
         { id: 1, name: "Marketing", count: 3 },
         { id: 2, name: "Support", count: 0 },
      ];
      promptRepoMock.pGetPromptCategoriesWithUsage.mockResolvedValue(
         categories
      );

      await promptService.renameCategory(userId, 1, " Vertrieb ");

      expect(promptRepoMock.pRenamePromptCategory).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pRenamePromptCategory).toHaveBeenCalledWith(
         userId,
         1,
         "Vertrieb"
      );
   });

   it("renaming to its own current name is not a conflict - test", async () => {
      const userId = "user-id-1";
      const categories: DPromptCategoryWithUsage[] = [
         { id: 1, name: "Marketing", count: 3 },
      ];
      promptRepoMock.pGetPromptCategoriesWithUsage.mockResolvedValue(
         categories
      );

      await promptService.renameCategory(userId, 1, "Marketing");

      expect(promptRepoMock.pRenamePromptCategory).toHaveBeenCalledWith(
         userId,
         1,
         "Marketing"
      );
   });

   it("name conflicts case-insensitively with another category - throws - test", async () => {
      const userId = "user-id-1";
      const categories: DPromptCategoryWithUsage[] = [
         { id: 1, name: "Marketing", count: 3 },
         { id: 2, name: "Support", count: 0 },
      ];
      promptRepoMock.pGetPromptCategoriesWithUsage.mockResolvedValue(
         categories
      );

      const fn = () => promptService.renameCategory(userId, 1, "  support  ");

      await expect(fn).rejects.toThrow(CategoryNameConflictError);
      expect(promptRepoMock.pRenamePromptCategory).not.toHaveBeenCalled();
   });
});

describe("deleteCategory tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("category deleted - test", async () => {
      const userId = "user-id-1";
      const categoryId = 1;

      await promptService.deleteCategory(userId, categoryId);

      expect(promptRepoMock.pDeletePromptCategory).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pDeletePromptCategory).toHaveBeenCalledWith(
         userId,
         categoryId
      );
   });
});

describe("isCategoryNameAvailable tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("name not taken - returns true - test", async () => {
      const userId = "user-id-1";
      const categoryId = 1;
      promptRepoMock.pPromptCategoryExists.mockResolvedValue(false);

      const result = await promptService.isCategoryNameAvailable(
         userId,
         categoryId,
         " Vertrieb "
      );

      expect(result).toBe(true);
      expect(promptRepoMock.pPromptCategoryExists).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pPromptCategoryExists).toHaveBeenCalledWith(
         userId,
         "Vertrieb",
         categoryId
      );
   });

   it("name already taken - returns false - test", async () => {
      const userId = "user-id-1";
      const categoryId = 1;
      promptRepoMock.pPromptCategoryExists.mockResolvedValue(true);

      const result = await promptService.isCategoryNameAvailable(
         userId,
         categoryId,
         "Support"
      );

      expect(result).toBe(false);
   });
});

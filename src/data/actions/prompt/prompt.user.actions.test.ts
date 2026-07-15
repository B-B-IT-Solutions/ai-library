jest.mock("@/data/services/prompt");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";

import { requireUser } from "@/data/actions/auth-utils";
import { EMPTY_PAGE } from "@/data/actions/utils";
import { PromptService } from "@/data/services/prompt";
import { CategoryNameConflictError } from "@/data/services/prompt/errors";
import {
   DPrompt,
   DPromptCategoryUsage,
   DPromptsUsage,
   DPromptVariableValues,
} from "@/data/types/domain/prompt";
import { DPrompt0Update } from "@/data/types/domain/prompt0";
import { ActionResult } from "@/data/types/utils";
import { SubscriptionAccessError } from "@/lib/subscription/server-guards";
import { AiLibAuthenticationError } from "../types";

import {
   composePromptFromTemplate,
   createPrompt,
   deleteCategory,
   deletePrompt,
   downloadPrompt,
   getCategoriesWithUsage,
   getPrompt,
   getPromptCategories,
   getPromptCategoriesPage,
   getPromptGenerationData,
   getPromptModels,
   getPromptPreviewsPage,
   getPromptsPage,
   getPromptsUsage,
   getPromptWithContent,
   renameCategory,
   togglePromptFavorite,
   updatePrompt,
} from "./prompt.user.actions";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const sGetPromptsPage = PromptService.prototype.getPromptsPage;
const sGetPrompt = PromptService.prototype.getPrompt;
const sCreatePrompt = PromptService.prototype.createPrompt;
const sUpdatePrompt = PromptService.prototype.updatePrompt;
const sDeletePrompt = PromptService.prototype.deletePrompt;
const sGetPromptGenerationData =
   PromptService.prototype.getPromptGenerationData;
const sComposePromptFromTemplate =
   PromptService.prototype.composePromptFromTemplate;
const sDownloadPrompt = PromptService.prototype.downloadPrompt;
const sTogglePromptFavorite = PromptService.prototype.togglePromptFavorite;
const sGetPromptCategories = PromptService.prototype.getPromptCategories;
const sGetPromptModels = PromptService.prototype.getPromptModels;
const sGetPromptPreviewsPage = PromptService.prototype.getPromptPreviewsPage;
const sGetPromptWithContent = PromptService.prototype.getPromptWithContent;
const sGetPromptCategoriesPage =
   PromptService.prototype.getPromptCategoriesPage;
const sGetPromptsUsage = PromptService.prototype.getPromptsUsage;

const sGetPromptsPageMock = sGetPromptsPage as jest.MockedFunction<
   typeof sGetPromptsPage
>;
const sGetPromptPreviewsPageMock =
   sGetPromptPreviewsPage as jest.MockedFunction<typeof sGetPromptPreviewsPage>;

const sGetPromptMock = sGetPrompt as jest.MockedFunction<typeof sGetPrompt>;
const sCreatePromptMock = sCreatePrompt as jest.MockedFunction<
   typeof sCreatePrompt
>;
const sUpdatePromptMock = sUpdatePrompt as jest.MockedFunction<
   typeof sUpdatePrompt
>;
const sDeletePromptMock = sDeletePrompt as jest.MockedFunction<
   typeof sDeletePrompt
>;
const sGetPromptGenerationDataMock =
   sGetPromptGenerationData as jest.MockedFunction<
      typeof sGetPromptGenerationData
   >;
const sComposePromptFromTemplateMock =
   sComposePromptFromTemplate as jest.MockedFunction<
      typeof sComposePromptFromTemplate
   >;
const sDownloadPromptMock = sDownloadPrompt as jest.MockedFunction<
   typeof sDownloadPrompt
>;
const sTogglePromptFavoriteMock = sTogglePromptFavorite as jest.MockedFunction<
   typeof sTogglePromptFavorite
>;
const sGetPromptCategoriesMock = sGetPromptCategories as jest.MockedFunction<
   typeof sGetPromptCategories
>;
const sGetPromptModelsMock = sGetPromptModels as jest.MockedFunction<
   typeof sGetPromptModels
>;
const sGetPromptWithContentMock = sGetPromptWithContent as jest.MockedFunction<
   typeof sGetPromptWithContent
>;
const sGetPromptsUsageMock = sGetPromptsUsage as jest.MockedFunction<
   typeof sGetPromptsUsage
>;
const sGetPromptCategoriesPageMock =
   sGetPromptCategoriesPage as jest.MockedFunction<
      typeof sGetPromptCategoriesPage
   >;

const sGetCategoriesWithUsage = PromptService.prototype.getCategoriesWithUsage;
const sRenameCategory = PromptService.prototype.renameCategory;
const sDeleteCategory = PromptService.prototype.deleteCategory;

const sGetCategoriesWithUsageMock =
   sGetCategoriesWithUsage as jest.MockedFunction<
      typeof sGetCategoriesWithUsage
   >;
const sRenameCategoryMock = sRenameCategory as jest.MockedFunction<
   typeof sRenameCategory
>;
const sDeleteCategoryMock = sDeleteCategory as jest.MockedFunction<
   typeof sDeleteCategory
>;

describe("getPromptsPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const result = await getPromptsPage();

      expect(result).toEqual(EMPTY_PAGE);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptsPageMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("prompts retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const page = dtestData.dPromptsPage();
      sGetPromptsPageMock.mockResolvedValue(page);

      const query = dtestData.dPromptsPageQuery();

      const result = await getPromptsPage(query);

      expect(result).toEqual(page);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptsPageMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptsPageMock).toHaveBeenCalledWith(user.id, query);
   });
});

describe("getPromptPreviewsPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const result = await getPromptPreviewsPage();

      expect(result).toEqual(EMPTY_PAGE);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptPreviewsPageMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("prompts retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const page = dtestData.dPromptPreviewsPage();
      sGetPromptPreviewsPageMock.mockResolvedValue(page);

      const query = dtestData.dPromptsPageQuery();

      const result = await getPromptPreviewsPage(query);

      expect(result).toEqual(page);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptPreviewsPageMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptPreviewsPageMock).toHaveBeenCalledWith(user.id, query);
   });
});

describe("getPrompt tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);
      const descriptorId = "a34e7e08-1806-419e-8f03-2e36a4f5466e";

      const result = await getPrompt(descriptorId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptMock).not.toHaveBeenCalled();
   });

   it("error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const errorMessage = "db error";
      const error = new Error(errorMessage);
      sGetPromptMock.mockRejectedValue(error);
      const descriptorId = "a34e7e08-1806-419e-8f03-2e36a4f5466e";

      const result = await getPrompt(descriptorId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptMock).toHaveBeenCalledWith(user.id, descriptorId);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(errorMessage);
   });

   it("prompt null - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      sGetPromptMock.mockResolvedValue(null);
      const descriptorId = "a34e7e08-1806-419e-8f03-2e36a4f5466e";

      const result = await getPrompt(descriptorId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptMock).toHaveBeenCalledWith(user.id, descriptorId);
   });

   it("prompt retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const descriptor = dtestData.dPrompt();
      sGetPromptMock.mockResolvedValue(descriptor);
      const descriptorId = "a34e7e08-1806-419e-8f03-2e36a4f5466e";

      const result = await getPrompt(descriptorId);

      expect(result).toEqual(descriptor);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptMock).toHaveBeenCalledWith(user.id, descriptorId);
   });
});

describe("getPromptWithContent tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const result = await getPromptWithContent(invalidId);

      expect(result).toBeNull();
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sGetPromptWithContentMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith("Invalid Template ID.");
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const templateId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPromptWithContent(templateId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptWithContentMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("prompt null - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      sGetPromptWithContentMock.mockResolvedValue(null);

      const templateId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPromptWithContent(templateId);

      expect(result).toBeNull();
      expect(sGetPromptWithContentMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptWithContentMock).toHaveBeenCalledWith(
         user.id,
         templateId
      );
   });

   it("prompt defined - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const prompt = dtestData.dPromptWithContent();
      sGetPromptWithContentMock.mockResolvedValue(prompt);

      const templateId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPromptWithContent(templateId);

      expect(result).toEqual(prompt);
      expect(sGetPromptWithContentMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptWithContentMock).toHaveBeenCalledWith(
         user.id,
         templateId
      );
   });
});

describe("createPrompt tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);
      const crate = dtestData.dPromptUpdateCrate();

      const result = await createPrompt(crate);

      const expectedResult: ActionResult = {
         success: false,
         message: "Vorlage konnte nicht erstellt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreatePromptMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("db error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("db error");
      sCreatePromptMock.mockRejectedValue(error);
      const crate = dtestData.dPromptUpdateCrate();

      const result = await createPrompt(crate);

      const expectedResult: ActionResult = {
         success: false,
         message: "Vorlage konnte nicht erstellt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreatePromptMock).toHaveBeenCalledTimes(1);
      expect(sCreatePromptMock).toHaveBeenCalledWith(user.id, crate);
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("subscription error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new SubscriptionAccessError("limit achieved", "maxPrompts");
      sCreatePromptMock.mockRejectedValue(error);
      const crate = dtestData.dPromptUpdateCrate();

      const result = await createPrompt(crate);

      const expectedResult: ActionResult = {
         success: false,
         message: error.message,
         upgradeRequired: true,
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreatePromptMock).toHaveBeenCalledTimes(1);
      expect(sCreatePromptMock).toHaveBeenCalledWith(user.id, crate);
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("prompt created - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const newPrompt = dtestData.dPrompt();
      sCreatePromptMock.mockResolvedValue(newPrompt);

      const crate = dtestData.dPromptUpdateCrate();

      const result = await createPrompt(crate);

      const expectedResult: ActionResult<DPrompt> = {
         success: true,
         message: "Vorlage erfolgreich erstellt",
         data: newPrompt,
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreatePromptMock).toHaveBeenCalledTimes(1);
      expect(sCreatePromptMock).toHaveBeenCalledWith(user.id, crate);
   });
});

describe("updatePrompt tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";
      const updateData = dtestData.dPromptUpdate();

      const result = await updatePrompt(invalidId, updateData);

      const expectedResult: ActionResult = {
         success: false,
         message: "Vorlage konnte nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sUpdatePromptMock).not.toHaveBeenCalled();
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";
      const updateData = dtestData.dPromptUpdate();

      const result = await updatePrompt(descriptorId, updateData);

      const expectedResult: ActionResult = {
         success: false,
         message: "Vorlage konnte nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sUpdatePromptMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("db error");
      sUpdatePromptMock.mockRejectedValue(error);

      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";
      const updateData = dtestData.dPromptUpdate();

      const result = await updatePrompt(descriptorId, updateData);

      const expectedResult: ActionResult = {
         success: false,
         message: "Vorlage konnte nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sUpdatePromptMock).toHaveBeenCalledTimes(1);
      expect(sUpdatePromptMock).toHaveBeenCalledWith(
         user.id,
         descriptorId,
         updateData
      );
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("descriptor updated - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      sUpdatePromptMock.mockResolvedValue();

      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";
      const updateData = dtestData.dPromptUpdate();

      const result = await updatePrompt(descriptorId, updateData);

      const expectedResult: ActionResult = {
         success: true,
         message: "Vorlage erfolgreich aktualisiert",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sUpdatePromptMock).toHaveBeenCalledTimes(1);
      expect(sUpdatePromptMock).toHaveBeenCalledWith(
         user.id,
         descriptorId,
         updateData
      );
   });
});

describe("deletePrompt tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const result = await deletePrompt(invalidId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Vorlage konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sDeletePromptMock).not.toHaveBeenCalled();
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";

      const result = await deletePrompt(descriptorId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Vorlage konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDeletePromptMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("db error");
      sDeletePromptMock.mockRejectedValue(error);

      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";

      const result = await deletePrompt(descriptorId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Vorlage konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDeletePromptMock).toHaveBeenCalledTimes(1);
      expect(sDeletePromptMock).toHaveBeenCalledWith(user.id, descriptorId);
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("descriptor deleted - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      sDeletePromptMock.mockResolvedValue();

      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";

      const result = await deletePrompt(descriptorId);

      const expectedResult: ActionResult = {
         success: true,
         message: "Vorlage erfolgreich gelöscht",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDeletePromptMock).toHaveBeenCalledTimes(1);
      expect(sDeletePromptMock).toHaveBeenCalledWith(user.id, descriptorId);
   });
});

describe("getPromptGenerationData tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const promptId = "prompt-template-id";
      const result = await getPromptGenerationData(promptId);

      expect(result).toEqual(null);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptGenerationDataMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("data retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const data = dtestData.dPromptTemplatingData();
      sGetPromptGenerationDataMock.mockResolvedValue(data);

      const promptId = "prompt-template-id";
      const result = await getPromptGenerationData(promptId);

      expect(result).toEqual(data);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptGenerationDataMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptGenerationDataMock).toHaveBeenCalledWith(
         user.id,
         promptId
      );
   });
});

describe("composePromptFromTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";
      const fieldValues: DPromptVariableValues = { field1: "value1" };

      const result = await composePromptFromTemplate(invalidId, fieldValues);

      const expectedResult: ActionResult = {
         success: false,
         message: "Prompt konnte nicht generiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sComposePromptFromTemplateMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith("Invalid Descriptor ID.");
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      const templateId = "123e4567-e89b-12d3-a456-426614174000";
      const fieldValues: DPromptVariableValues = { field1: "value1" };
      requireUserMock.mockRejectedValue(error);

      const result = await composePromptFromTemplate(templateId, fieldValues);
      const expectedResult: ActionResult = {
         success: false,
         message: "Prompt konnte nicht generiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sComposePromptFromTemplateMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const templateId = "123e4567-e89b-12d3-a456-426614174000";
      const fieldValues: DPromptVariableValues = {
         name: "User-1 Name",
         email: "invalid-email",
      };
      const errorMessage = "Provided template fields are invalid";
      const error = new Error(errorMessage);
      sComposePromptFromTemplateMock.mockRejectedValue(error);

      const result = await composePromptFromTemplate(templateId, fieldValues);
      const expectedResult: ActionResult = {
         success: false,
         message: "Prompt konnte nicht generiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(sComposePromptFromTemplateMock).toHaveBeenCalledTimes(1);
      expect(sComposePromptFromTemplateMock).toHaveBeenCalledWith(
         user.id,
         templateId,
         fieldValues
      );
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("success - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const templateId = "123e4567-e89b-12d3-a456-426614174000";
      const fieldValues: DPromptVariableValues = {
         name: "User-1 Name",
         email: "test1@email.com",
         age: 30,
      };
      const promptData = dtestData.dPrompt0Update();
      sComposePromptFromTemplateMock.mockResolvedValue(promptData);

      const result = await composePromptFromTemplate(templateId, fieldValues);
      const expectedResult: ActionResult<DPrompt0Update> = {
         success: true,
         message: "Prompt erfolgreich generiert",
         data: promptData,
      };

      expect(result).toEqual(expectedResult);
      expect(sComposePromptFromTemplateMock).toHaveBeenCalledTimes(1);
      expect(sComposePromptFromTemplateMock).toHaveBeenCalledWith(
         user.id,
         templateId,
         fieldValues
      );
   });
});

describe("downloadPrompt tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";
      const errorMessage = "Invalid Descriptor ID.";

      const result = await downloadPrompt(invalidId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Vorlage konnte nicht heruntergeladen werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sDownloadPromptMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(errorMessage);
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      const templateId = "123e4567-e89b-12d3-a456-426614174000";
      requireUserMock.mockRejectedValue(error);

      const result = await downloadPrompt(templateId);
      const expectedResult = {
         success: false,
         message: "Vorlage konnte nicht heruntergeladen werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDownloadPromptMock).not.toHaveBeenCalled();
   });

   it("error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";
      const errorMessage = "Template not found";
      const error = new Error(errorMessage);
      sDownloadPromptMock.mockRejectedValue(error);

      const result = await downloadPrompt(descriptorId);
      const expectedResult = {
         success: false,
         message: "Vorlage konnte nicht heruntergeladen werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDownloadPromptMock).toHaveBeenCalledTimes(1);
      expect(sDownloadPromptMock).toHaveBeenCalledWith(user.id, descriptorId);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(errorMessage);
   });

   it("tempalte downloaded - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";
      const downloadData = "template content data";
      sDownloadPromptMock.mockResolvedValue(downloadData);

      const result = await downloadPrompt(descriptorId);
      const expectedResult = {
         success: true,
         message: "Vorlage erfolgreich heruntergeladen.",
         data: downloadData,
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDownloadPromptMock).toHaveBeenCalledTimes(1);
      expect(sDownloadPromptMock).toHaveBeenCalledWith(user.id, descriptorId);
   });
});

describe("togglePromptFavorite tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";
      const isFavorite = true;

      const result = await togglePromptFavorite(invalidId, isFavorite);

      const expectedResult: ActionResult = {
         success: false,
         message: "Die Anfrage konnte nicht bearbeitet werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sTogglePromptFavoriteMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith("Invalid Descriptor ID.");
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const promptId = "123e4567-e89b-12d3-a456-426614174000";
      const isFavorite = true;

      const result = await togglePromptFavorite(promptId, isFavorite);
      const expectedResult: ActionResult = {
         success: false,
         message: "Die Anfrage konnte nicht bearbeitet werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sTogglePromptFavoriteMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("toggled - isFavoriete true - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const promptId = "123e4567-e89b-12d3-a456-426614174000";
      const isFavorite = true;

      sTogglePromptFavoriteMock.mockResolvedValue();

      const result = await togglePromptFavorite(promptId, isFavorite);
      const expectedResult: ActionResult<DPrompt0Update> = {
         success: true,
         message: "Zu Favoriten hinzugefügt",
      };

      expect(result).toEqual(expectedResult);
      expect(sTogglePromptFavoriteMock).toHaveBeenCalledTimes(1);
      expect(sTogglePromptFavoriteMock).toHaveBeenCalledWith(
         user.id,
         promptId,
         isFavorite
      );
   });

   it("toggled - isFavoriete false - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const promptId = "123e4567-e89b-12d3-a456-426614174000";
      const isFavorite = false;

      sTogglePromptFavoriteMock.mockResolvedValue();

      const result = await togglePromptFavorite(promptId, isFavorite);
      const expectedResult: ActionResult<DPrompt0Update> = {
         success: true,
         message: "Aus Favoriten entfernt",
      };

      expect(result).toEqual(expectedResult);
      expect(sTogglePromptFavoriteMock).toHaveBeenCalledTimes(1);
      expect(sTogglePromptFavoriteMock).toHaveBeenCalledWith(
         user.id,
         promptId,
         isFavorite
      );
   });
});

describe("getPromptCategoriesPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const result = await getPromptCategoriesPage();

      expect(result).toEqual(EMPTY_PAGE);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptCategoriesPageMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("categories page retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const page = dtestData.dPromptCategoriesPage();
      sGetPromptCategoriesPageMock.mockResolvedValue(page);

      const query = dtestData.dPromptCategoriesPageQuery();

      const result = await getPromptCategoriesPage(query);

      expect(result).toEqual(page);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptCategoriesPageMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptCategoriesPageMock).toHaveBeenCalledWith(user.id, query);
   });
});

describe("getPromptCategories tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const result = await getPromptCategories();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptCategoriesMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("categories retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const categories = dtestData.dTemplateCategories();
      sGetPromptCategoriesMock.mockResolvedValue(categories);

      const result = await getPromptCategories();

      expect(result).toEqual(categories);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptCategoriesMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptCategoriesMock).toHaveBeenCalledWith(user.id);
   });
});

describe("getPromptModels tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const result = await getPromptModels();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptModelsMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("models retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const models = dtestData.dTemplateModels();
      sGetPromptModelsMock.mockResolvedValue(models);

      const result = await getPromptModels();

      expect(result).toEqual(models);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptModelsMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptModelsMock).toHaveBeenCalledWith(user.id);
   });
});

describe("getPromptsUsage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("user undefined - test", async () => {
      const error = new AiLibAuthenticationError("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const result = await getPromptsUsage();

      const expectedResult: DPromptsUsage = {
         current: 0,
         limit: 0,
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptsUsageMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("db error");
      sGetPromptsUsageMock.mockRejectedValue(error);

      const result = await getPromptsUsage();

      const expectedResult: DPromptsUsage = {
         current: 0,
         limit: -1,
      };
      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptsUsageMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptsUsageMock).toHaveBeenCalledWith(user.id);
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("prompt usage retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const usage = dtestData.dPromptsUsage();
      sGetPromptsUsageMock.mockResolvedValue(usage);

      const result = await getPromptsUsage();

      expect(result).toEqual(usage);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptsUsageMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptsUsageMock).toHaveBeenCalledWith(user.id);
   });
});

describe("getCategoriesWithUsage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const result = await getCategoriesWithUsage();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetCategoriesWithUsageMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("categories with usage retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const categories: DPromptCategoryUsage[] = [
         { id: 1, name: "Marketing", count: 3 },
      ];
      sGetCategoriesWithUsageMock.mockResolvedValue(categories);

      const result = await getCategoriesWithUsage();

      expect(result).toEqual(categories);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetCategoriesWithUsageMock).toHaveBeenCalledTimes(1);
      expect(sGetCategoriesWithUsageMock).toHaveBeenCalledWith(user.id);
   });
});

describe("renameCategory tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid name - too long - test", async () => {
      const result = await renameCategory(1, "a".repeat(51));

      const expectedResult: ActionResult = {
         success: false,
         message: "Kategorie konnte nicht umbenannt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sRenameCategoryMock).not.toHaveBeenCalled();
   });

   it("invalid name - empty - test", async () => {
      const result = await renameCategory(1, "   ");

      expect(result).toEqual({
         success: false,
         message: "Kategorie konnte nicht umbenannt werden",
      });
      expect(sRenameCategoryMock).not.toHaveBeenCalled();
   });

   it("category renamed - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      sRenameCategoryMock.mockResolvedValue(undefined);

      const result = await renameCategory(1, "Vertrieb");

      const expectedResult: ActionResult = {
         success: true,
         message: "Kategorie erfolgreich umbenannt",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sRenameCategoryMock).toHaveBeenCalledTimes(1);
      expect(sRenameCategoryMock).toHaveBeenCalledWith(user.id, 1, "Vertrieb");
   });

   it("name conflict - surfaces specific message - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new CategoryNameConflictError("Support");
      sRenameCategoryMock.mockRejectedValue(error);

      const result = await renameCategory(1, "Support");

      const expectedResult: ActionResult = {
         success: false,
         message: error.message,
      };

      expect(result).toEqual(expectedResult);
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("unexpected error - generic message - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      sRenameCategoryMock.mockRejectedValue(new Error("db down"));

      const result = await renameCategory(1, "Vertrieb");

      expect(result).toEqual({
         success: false,
         message: "Kategorie konnte nicht umbenannt werden",
      });
   });
});

describe("deleteCategory tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("category deleted - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      sDeleteCategoryMock.mockResolvedValue(undefined);

      const result = await deleteCategory(1);

      const expectedResult: ActionResult = {
         success: true,
         message: "Kategorie erfolgreich gelöscht",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDeleteCategoryMock).toHaveBeenCalledTimes(1);
      expect(sDeleteCategoryMock).toHaveBeenCalledWith(user.id, 1);
   });

   it("unexpected error - generic message - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      sDeleteCategoryMock.mockRejectedValue(new Error("db down"));

      const result = await deleteCategory(1);

      expect(result).toEqual({
         success: false,
         message: "Kategorie konnte nicht gelöscht werden",
      });
   });
});

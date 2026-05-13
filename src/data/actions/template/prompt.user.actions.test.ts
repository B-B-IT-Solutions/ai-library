jest.mock("@/data/services/template");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";

import { requireUser } from "@/data/actions/auth-utils";
import { EMPTY_PAGE } from "@/data/actions/utils";
import { TemplateService } from "@/data/services/template";
import { DPromptFieldValues } from "@/data/types/domain/prompt";
import { DPrompt0Update } from "@/data/types/domain/prompt0";
import { ActionResult } from "@/data/types/utils";

import {
   composePromptFromTemplate,
   createTemplateDescriptor,
   deleteTemplateDescriptor,
   downloadTemplate,
   getPromptGenerationTemplateData,
   getPromptTemplate,
   getPromptTemplateCategories,
   getPromptTemplates,
   getTemplateDescriptor,
   getTemplateDescriptorCategories,
   getTemplateDescriptorModels,
   getTemplateDescriptorsPage,
   toggleTemplateDescriptorFavorite,
   updateTemplateDescriptor,
} from "./prompt.user.actions";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const sGetTemplateDescriptorsPage =
   TemplateService.prototype.getTemplateDescriptorsPage;
const sGetTemplateDescriptor = TemplateService.prototype.getTemplateDescriptor;
const sCreateTemplateDescriptor =
   TemplateService.prototype.createTemplateDescriptor;
const sUpdateTemplateDescriptor =
   TemplateService.prototype.updateTemplateDescriptor;
const sDeleteTemplateDescriptor =
   TemplateService.prototype.deleteTemplateDescriptor;
const sGetTemplateDataForPromptGeneration =
   TemplateService.prototype.getTemplateDataForPromptGeneration;
const sComposePromptFromTemplate =
   TemplateService.prototype.composePromptFromTemplate;
const sDownloadTemplate = TemplateService.prototype.downloadTemplate;
const sToggleTemplateDescriptorFavorite =
   TemplateService.prototype.toggleTemplateDescriptorFavorite;
const sGetTemplateDescriptorCategories =
   TemplateService.prototype.getTemplateDescriptorCategories;
const sGetTemplateDescriptorModels =
   TemplateService.prototype.getTemplateDescriptorModels;
const sGetPrompts = TemplateService.prototype.getPrompts;
const sGetPromptTemplate = TemplateService.prototype.getPromptTemplate;
const sGetPromptTemplateCategories =
   TemplateService.prototype.getPromptTemplateCategories;

const sGetTemplateDescriptorsPageMock =
   sGetTemplateDescriptorsPage as jest.MockedFunction<
      typeof sGetTemplateDescriptorsPage
   >;
const sGetTemplateDescriptorMock =
   sGetTemplateDescriptor as jest.MockedFunction<typeof sGetTemplateDescriptor>;
const sCreateTemplateDescriptorMock =
   sCreateTemplateDescriptor as jest.MockedFunction<
      typeof sCreateTemplateDescriptor
   >;
const sUpdateTemplateDescriptorMock =
   sUpdateTemplateDescriptor as jest.MockedFunction<
      typeof sUpdateTemplateDescriptor
   >;
const sDeleteTemplateDescriptorMock =
   sDeleteTemplateDescriptor as jest.MockedFunction<
      typeof sDeleteTemplateDescriptor
   >;
const sGetTemplateDataForPromptGenerationMock =
   sGetTemplateDataForPromptGeneration as jest.MockedFunction<
      typeof sGetTemplateDataForPromptGeneration
   >;
const sComposePromptFromTemplateMock =
   sComposePromptFromTemplate as jest.MockedFunction<
      typeof sComposePromptFromTemplate
   >;
const sDownloadTemplateMock = sDownloadTemplate as jest.MockedFunction<
   typeof sDownloadTemplate
>;
const sToggleTemplateDescriptorFavoriteMock =
   sToggleTemplateDescriptorFavorite as jest.MockedFunction<
      typeof sToggleTemplateDescriptorFavorite
   >;
const sGetTemplateDescriptorCategoriesMock =
   sGetTemplateDescriptorCategories as jest.MockedFunction<
      typeof sGetTemplateDescriptorCategories
   >;
const sGetTemplateDescriptorModelsMock =
   sGetTemplateDescriptorModels as jest.MockedFunction<
      typeof sGetTemplateDescriptorModels
   >;
const sGetPromptsMock = sGetPrompts as jest.MockedFunction<typeof sGetPrompts>;
const sGetPromptTemplateMock = sGetPromptTemplate as jest.MockedFunction<
   typeof sGetPromptTemplate
>;
const sGetPromptTemplateCategoriesMock =
   sGetPromptTemplateCategories as jest.MockedFunction<
      typeof sGetPromptTemplateCategories
   >;

describe("getTemplateDescriptorsPage tests", () => {
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

      const result = await getTemplateDescriptorsPage();

      expect(result).toEqual(EMPTY_PAGE);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetTemplateDescriptorsPageMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("descriptors retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const page = dtestData.dPromptsPage();
      sGetTemplateDescriptorsPageMock.mockResolvedValue(page);

      const query = dtestData.dTemplateDescriptorsPageQuery();

      const result = await getTemplateDescriptorsPage(query);

      expect(result).toEqual(page);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetTemplateDescriptorsPageMock).toHaveBeenCalledTimes(1);
      expect(sGetTemplateDescriptorsPageMock).toHaveBeenCalledWith(
         user.id,
         query
      );
   });
});

describe("getTemplateDescriptor tests", () => {
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

      const result = await getTemplateDescriptor(descriptorId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetTemplateDescriptorMock).not.toHaveBeenCalled();
   });

   it("error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const errorMessage = "db error";
      const error = new Error(errorMessage);
      sGetTemplateDescriptorMock.mockRejectedValue(error);
      const descriptorId = "a34e7e08-1806-419e-8f03-2e36a4f5466e";

      const result = await getTemplateDescriptor(descriptorId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetTemplateDescriptorMock).toHaveBeenCalledTimes(1);
      expect(sGetTemplateDescriptorMock).toHaveBeenCalledWith(
         user.id,
         descriptorId
      );
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(errorMessage);
   });

   it("descriptor null - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      sGetTemplateDescriptorMock.mockResolvedValue(null);
      const descriptorId = "a34e7e08-1806-419e-8f03-2e36a4f5466e";

      const result = await getTemplateDescriptor(descriptorId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetTemplateDescriptorMock).toHaveBeenCalledTimes(1);
      expect(sGetTemplateDescriptorMock).toHaveBeenCalledWith(
         user.id,
         descriptorId
      );
   });

   it("descriptor retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const descriptor = dtestData.dPrompt();
      sGetTemplateDescriptorMock.mockResolvedValue(descriptor);
      const descriptorId = "a34e7e08-1806-419e-8f03-2e36a4f5466e";

      const result = await getTemplateDescriptor(descriptorId);

      expect(result).toEqual(descriptor);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetTemplateDescriptorMock).toHaveBeenCalledTimes(1);
      expect(sGetTemplateDescriptorMock).toHaveBeenCalledWith(
         user.id,
         descriptorId
      );
   });
});

describe("createTemplateDescriptor tests", () => {
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
      const updateData = dtestData.dPromptUpdate();

      const result = await createTemplateDescriptor(updateData);

      const expectedResult: ActionResult = {
         success: false,
         message: "Vorlage konnte nicht erstellt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreateTemplateDescriptorMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("db error");
      sCreateTemplateDescriptorMock.mockRejectedValue(error);
      const updateData = dtestData.dPromptUpdate();

      const result = await createTemplateDescriptor(updateData);

      const expectedResult: ActionResult = {
         success: false,
         message: "Vorlage konnte nicht erstellt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreateTemplateDescriptorMock).toHaveBeenCalledTimes(1);
      expect(sCreateTemplateDescriptorMock).toHaveBeenCalledWith(
         user.id,
         updateData
      );
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("descriptor created - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const newDescriptor = dtestData.dPrompt();
      sCreateTemplateDescriptorMock.mockResolvedValue(newDescriptor);

      const updateData = dtestData.dPromptUpdate();

      const result = await createTemplateDescriptor(updateData);

      const expectedResult: ActionResult = {
         success: true,
         message: "Vorlage erfolgreich erstellt",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreateTemplateDescriptorMock).toHaveBeenCalledTimes(1);
      expect(sCreateTemplateDescriptorMock).toHaveBeenCalledWith(
         user.id,
         updateData
      );
   });
});

describe("updateTemplateDescriptor tests", () => {
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

      const result = await updateTemplateDescriptor(invalidId, updateData);

      const expectedResult: ActionResult = {
         success: false,
         message: "Vorlage konnte nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sUpdateTemplateDescriptorMock).not.toHaveBeenCalled();
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";
      const updateData = dtestData.dPromptUpdate();

      const result = await updateTemplateDescriptor(descriptorId, updateData);

      const expectedResult: ActionResult = {
         success: false,
         message: "Vorlage konnte nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sUpdateTemplateDescriptorMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("db error");
      sUpdateTemplateDescriptorMock.mockRejectedValue(error);

      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";
      const updateData = dtestData.dPromptUpdate();

      const result = await updateTemplateDescriptor(descriptorId, updateData);

      const expectedResult: ActionResult = {
         success: false,
         message: "Vorlage konnte nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sUpdateTemplateDescriptorMock).toHaveBeenCalledTimes(1);
      expect(sUpdateTemplateDescriptorMock).toHaveBeenCalledWith(
         user.id,
         descriptorId,
         updateData
      );
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("descriptor updated - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      sUpdateTemplateDescriptorMock.mockResolvedValue();

      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";
      const updateData = dtestData.dPromptUpdate();

      const result = await updateTemplateDescriptor(descriptorId, updateData);

      const expectedResult: ActionResult = {
         success: true,
         message: "Vorlage erfolgreich aktualisiert",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sUpdateTemplateDescriptorMock).toHaveBeenCalledTimes(1);
      expect(sUpdateTemplateDescriptorMock).toHaveBeenCalledWith(
         user.id,
         descriptorId,
         updateData
      );
   });
});

describe("deleteTemplateDescriptor tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const result = await deleteTemplateDescriptor(invalidId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Vorlage konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sDeleteTemplateDescriptorMock).not.toHaveBeenCalled();
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";

      const result = await deleteTemplateDescriptor(descriptorId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Vorlage konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDeleteTemplateDescriptorMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("db error");
      sDeleteTemplateDescriptorMock.mockRejectedValue(error);

      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";

      const result = await deleteTemplateDescriptor(descriptorId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Vorlage konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDeleteTemplateDescriptorMock).toHaveBeenCalledTimes(1);
      expect(sDeleteTemplateDescriptorMock).toHaveBeenCalledWith(
         user.id,
         descriptorId
      );
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("descriptor deleted - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      sDeleteTemplateDescriptorMock.mockResolvedValue();

      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";

      const result = await deleteTemplateDescriptor(descriptorId);

      const expectedResult: ActionResult = {
         success: true,
         message: "Vorlage erfolgreich gelöscht",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDeleteTemplateDescriptorMock).toHaveBeenCalledTimes(1);
      expect(sDeleteTemplateDescriptorMock).toHaveBeenCalledWith(
         user.id,
         descriptorId
      );
   });
});

describe("getPromptGenerationTemplateData tests", () => {
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

      const templateId = "prompt-template-id";
      const result = await getPromptGenerationTemplateData(templateId);

      expect(result).toEqual(null);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetTemplateDataForPromptGenerationMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("data retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const data = dtestData.dPromptGenerationData();
      sGetTemplateDataForPromptGenerationMock.mockResolvedValue(data);

      const templateId = "prompt-template-id";
      const result = await getPromptGenerationTemplateData(templateId);

      expect(result).toEqual(data);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetTemplateDataForPromptGenerationMock).toHaveBeenCalledTimes(1);
      expect(sGetTemplateDataForPromptGenerationMock).toHaveBeenCalledWith(
         user.id,
         templateId
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
      const fieldValues: DPromptFieldValues = { field1: "value1" };

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
      const fieldValues: DPromptFieldValues = { field1: "value1" };
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
      const fieldValues: DPromptFieldValues = {
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
      const fieldValues: DPromptFieldValues = {
         name: "User-1 Name",
         email: "test1@email.com",
         age: 30,
      };
      const promptData = dtestData.dPromptUpdate();
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

describe("downloadTemplate tests", () => {
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

      const result = await downloadTemplate(invalidId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Vorlage konnte nicht heruntergeladen werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sDownloadTemplateMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(errorMessage);
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      const templateId = "123e4567-e89b-12d3-a456-426614174000";
      requireUserMock.mockRejectedValue(error);

      const result = await downloadTemplate(templateId);
      const expectedResult = {
         success: false,
         message: "Vorlage konnte nicht heruntergeladen werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDownloadTemplateMock).not.toHaveBeenCalled();
   });

   it("error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";
      const errorMessage = "Template not found";
      const error = new Error(errorMessage);
      sDownloadTemplateMock.mockRejectedValue(error);

      const result = await downloadTemplate(descriptorId);
      const expectedResult = {
         success: false,
         message: "Vorlage konnte nicht heruntergeladen werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDownloadTemplateMock).toHaveBeenCalledTimes(1);
      expect(sDownloadTemplateMock).toHaveBeenCalledWith(user.id, descriptorId);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(errorMessage);
   });

   it("tempalte downloaded - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";
      const downloadData = "template content data";
      sDownloadTemplateMock.mockResolvedValue(downloadData);

      const result = await downloadTemplate(descriptorId);
      const expectedResult = {
         success: true,
         message: "Vorlage erfolgreich heruntergeladen.",
         data: downloadData,
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDownloadTemplateMock).toHaveBeenCalledTimes(1);
      expect(sDownloadTemplateMock).toHaveBeenCalledWith(user.id, descriptorId);
   });
});

describe("toggleTemplateDescriptorFavorite tests", () => {
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

      const result = await toggleTemplateDescriptorFavorite(
         invalidId,
         isFavorite
      );

      const expectedResult: ActionResult = {
         success: false,
         message: "Die Anfrage konnte nicht bearbeitet werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sToggleTemplateDescriptorFavoriteMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith("Invalid Descriptor ID.");
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";
      const isFavorite = true;

      const result = await toggleTemplateDescriptorFavorite(
         descriptorId,
         isFavorite
      );
      const expectedResult: ActionResult = {
         success: false,
         message: "Die Anfrage konnte nicht bearbeitet werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sToggleTemplateDescriptorFavoriteMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("toggled - isFavoriete true - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";
      const isFavorite = true;

      sToggleTemplateDescriptorFavoriteMock.mockResolvedValue();

      const result = await toggleTemplateDescriptorFavorite(
         descriptorId,
         isFavorite
      );
      const expectedResult: ActionResult<DPrompt0Update> = {
         success: true,
         message: "Zu Favoriten hinzugefügt",
      };

      expect(result).toEqual(expectedResult);
      expect(sToggleTemplateDescriptorFavoriteMock).toHaveBeenCalledTimes(1);
      expect(sToggleTemplateDescriptorFavoriteMock).toHaveBeenCalledWith(
         user.id,
         descriptorId,
         isFavorite
      );
   });

   it("toggled - isFavoriete false - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";
      const isFavorite = false;

      sToggleTemplateDescriptorFavoriteMock.mockResolvedValue();

      const result = await toggleTemplateDescriptorFavorite(
         descriptorId,
         isFavorite
      );
      const expectedResult: ActionResult<DPrompt0Update> = {
         success: true,
         message: "Aus Favoriten entfernt",
      };

      expect(result).toEqual(expectedResult);
      expect(sToggleTemplateDescriptorFavoriteMock).toHaveBeenCalledTimes(1);
      expect(sToggleTemplateDescriptorFavoriteMock).toHaveBeenCalledWith(
         user.id,
         descriptorId,
         isFavorite
      );
   });
});

describe("getTemplateDescriptorCategories tests", () => {
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

      const result = await getTemplateDescriptorCategories();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetTemplateDescriptorCategoriesMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("categories retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const categories = dtestData.dTemplateCategories();
      sGetTemplateDescriptorCategoriesMock.mockResolvedValue(categories);

      const result = await getTemplateDescriptorCategories();

      expect(result).toEqual(categories);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetTemplateDescriptorCategoriesMock).toHaveBeenCalledTimes(1);
      expect(sGetTemplateDescriptorCategoriesMock).toHaveBeenCalledWith(
         user.id
      );
   });
});

describe("getTemplateDescriptorModels tests", () => {
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

      const result = await getTemplateDescriptorModels();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetTemplateDescriptorModelsMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("models retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const models = dtestData.dTemplateModels();
      sGetTemplateDescriptorModelsMock.mockResolvedValue(models);

      const result = await getTemplateDescriptorModels();

      expect(result).toEqual(models);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetTemplateDescriptorModelsMock).toHaveBeenCalledTimes(1);
      expect(sGetTemplateDescriptorModelsMock).toHaveBeenCalledWith(user.id);
   });
});

describe("getPromptTemplates tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getPromptTemplates - params undefined - test", async () => {
      const templates = dtestData.dPrompts();
      sGetPromptsMock.mockResolvedValue(templates);

      const result = await getPromptTemplates();

      expect(result).toEqual(templates);
      expect(sGetPromptsMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptsMock).toHaveBeenCalledWith(undefined);
   });

   it("getPromptTemplates - params empty - test", async () => {
      const templates = dtestData.dPrompts();
      sGetPromptsMock.mockResolvedValue(templates);

      const result = await getPromptTemplates({});

      expect(result).toEqual(templates);
      expect(sGetPromptsMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptsMock).toHaveBeenCalledWith({});
   });

   it("getPromptTemplates - params defined - test", async () => {
      const templates = dtestData.dPrompts();
      sGetPromptsMock.mockResolvedValue(templates);

      const search = "prompt 123";
      const categories = ["cat 1", "cat2", "cat 3"];
      const params = { search, categories };

      const result = await getPromptTemplates(params);

      expect(result).toEqual(templates);
      expect(sGetPromptsMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptsMock).toHaveBeenCalledWith(params);
   });
});

describe("getPromptTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("getPromptTemplate - invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const result = await getPromptTemplate(invalidId);

      expect(result).toBeNull();
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sGetPromptTemplateMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith("Invalid Template ID.");
   });

   it("getPromptTemplate - user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const templateId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPromptTemplate(templateId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptTemplateMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("getPromptTemplate - promptTemplate null - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      sGetPromptTemplateMock.mockResolvedValue(null);

      const templateId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPromptTemplate(templateId);

      expect(result).toBeNull();
      expect(sGetPromptTemplateMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptTemplateMock).toHaveBeenCalledWith(user.id, templateId);
   });

   it("getPromptTemplate - promptTemplate defined - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const prompt = dtestData.dPromptWithContent();
      sGetPromptTemplateMock.mockResolvedValue(prompt);

      const templateId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPromptTemplate(templateId);

      expect(result).toEqual(prompt);
      expect(sGetPromptTemplateMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptTemplateMock).toHaveBeenCalledWith(user.id, templateId);
   });
});

describe("getPromptTemplateCategories tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("getPromptTemplateCategories - user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const result = await getPromptTemplateCategories();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptTemplateCategoriesMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("getPromptTemplateCategories test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const categories = dtestData.dPromptCategoriesString();
      sGetPromptTemplateCategoriesMock.mockResolvedValue(categories);

      const result = await getPromptTemplateCategories();

      expect(result).toEqual(categories);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptTemplateCategoriesMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptTemplateCategoriesMock).toHaveBeenCalledWith(user.id);
   });
});

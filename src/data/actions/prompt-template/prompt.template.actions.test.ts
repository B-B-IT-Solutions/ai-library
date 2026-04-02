jest.mock("@/data/services/prompt-template");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";

import { requireUser } from "@/data/actions/auth-utils";
import { EMPTY_PAGE } from "@/data/actions/utils";
import { PromptTemplateService } from "@/data/services/prompt-template";

import {
   getPromptGenerationTemplateData,
   getPromptTemplate,
   getPromptTemplateCategories,
   getPromptTemplates,
   getTemplateDescriptor,
   getTemplateDescriptorsPage,
} from "./prompt.template.actions";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const sGetTemplateDescriptorsPage =
   PromptTemplateService.prototype.getTemplateDescriptorsPage;
const sGetTemplateDescriptor =
   PromptTemplateService.prototype.getTemplateDescriptor;
const sGetTemplateDataForPromptGeneration =
   PromptTemplateService.prototype.getTemplateDataForPromptGeneration;
const sGetPromptTemplateDescriptors =
   PromptTemplateService.prototype.getPromptTemplateDescriptors;
const sGetPromptTemplate = PromptTemplateService.prototype.getPromptTemplate;
const sGetPromptTemplateCategories =
   PromptTemplateService.prototype.getPromptTemplateCategories;

const sGetTemplateDescriptorsPageMock =
   sGetTemplateDescriptorsPage as jest.MockedFunction<
      typeof sGetTemplateDescriptorsPage
   >;
const sGetTemplateDescriptorMock =
   sGetTemplateDescriptor as jest.MockedFunction<typeof sGetTemplateDescriptor>;
const sGetTemplateDataForPromptGenerationMock =
   sGetTemplateDataForPromptGeneration as jest.MockedFunction<
      typeof sGetTemplateDataForPromptGeneration
   >;
const sGetPromptTemplateDescriptorsMock =
   sGetPromptTemplateDescriptors as jest.MockedFunction<
      typeof sGetPromptTemplateDescriptors
   >;
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

   it("getTemplateDescriptorsPage - user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const result = await getTemplateDescriptorsPage();

      expect(result).toEqual(EMPTY_PAGE);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetTemplateDescriptorsPageMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("getTemplateDescriptorsPage - descriptors retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const page = dtestData.dTemplateDescriptorsPage();
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

   it("getTemplateDescriptor - user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);
      const descriptorId = "a34e7e08-1806-419e-8f03-2e36a4f5466e";

      const result = await getTemplateDescriptor(descriptorId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetTemplateDescriptorMock).not.toHaveBeenCalled();
   });

   it("getTemplateDescriptor - error - test", async () => {
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

   it("getTemplateDescriptor - descriptor null - test", async () => {
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

   it("getTemplateDescriptor - descriptor retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();
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

describe("getPromptGenerationTemplateData tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("getPromptGenerationTemplateData - user undefined - test", async () => {
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

   it("getPromptGenerationTemplateData - data retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const data = dtestData.dPromptTemplateDataPromptGeneration();
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

describe("getPromptTemplates tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getPromptTemplates - params undefined - test", async () => {
      const templates = dtestData.dPromptTemplateDescriptors();
      sGetPromptTemplateDescriptorsMock.mockResolvedValue(templates);

      const result = await getPromptTemplates();

      expect(result).toEqual(templates);
      expect(sGetPromptTemplateDescriptorsMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptTemplateDescriptorsMock).toHaveBeenCalledWith(undefined);
   });

   it("getPromptTemplates - params empty - test", async () => {
      const templates = dtestData.dPromptTemplateDescriptors();
      sGetPromptTemplateDescriptorsMock.mockResolvedValue(templates);

      const result = await getPromptTemplates({});

      expect(result).toEqual(templates);
      expect(sGetPromptTemplateDescriptorsMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptTemplateDescriptorsMock).toHaveBeenCalledWith({});
   });

   it("getPromptTemplates - params defined - test", async () => {
      const templates = dtestData.dPromptTemplateDescriptors();
      sGetPromptTemplateDescriptorsMock.mockResolvedValue(templates);

      const search = "prompt 123";
      const categories = ["cat 1", "cat2", "cat 3"];
      const params = { search, categories };

      const result = await getPromptTemplates(params);

      expect(result).toEqual(templates);
      expect(sGetPromptTemplateDescriptorsMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptTemplateDescriptorsMock).toHaveBeenCalledWith(params);
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

      const prompt = dtestData.dPromptTemplate();
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

      const categories = dtestData.dPromptTemplateCategoriesString();
      sGetPromptTemplateCategoriesMock.mockResolvedValue(categories);

      const result = await getPromptTemplateCategories();

      expect(result).toEqual(categories);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptTemplateCategoriesMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptTemplateCategoriesMock).toHaveBeenCalledWith(user.id);
   });
});

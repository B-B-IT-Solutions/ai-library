jest.mock("@/data/services/prompt");

import { dtestData } from "@tests";

import { EMPTY_PAGE } from "@/data/actions/utils";
import { PublicPromptService } from "@/data/services/prompt";

import {
   getPublicPrompt,
   getPublicPromptContent,
   getPublicPromptGenerationData,
   getPublicPromptsPage,
} from "./prompt.public.actions";

const sGetPublicTemplateDescriptorsPage =
   PublicPromptService.prototype.getPublicTemplateDescriptorsPage;
const sGetPublicTemplateDescriptor =
   PublicPromptService.prototype.getPublicTemplateDescriptor;
const sGetPublicPromptTemplate =
   PublicPromptService.prototype.getPublicPromptTemplate;
const sGetPublicTemplateDataForPromptGeneration =
   PublicPromptService.prototype.getPublicTemplateDataForPromptGeneration;

const sGetPublicTemplateDescriptorsPageMock =
   sGetPublicTemplateDescriptorsPage as jest.MockedFunction<
      typeof sGetPublicTemplateDescriptorsPage
   >;
const sGetPublicTemplateDescriptorMock =
   sGetPublicTemplateDescriptor as jest.MockedFunction<
      typeof sGetPublicTemplateDescriptor
   >;
const sGetPublicPromptTemplateMock =
   sGetPublicPromptTemplate as jest.MockedFunction<
      typeof sGetPublicPromptTemplate
   >;
const sGetPublicTemplateDataForPromptGenerationMock =
   sGetPublicTemplateDataForPromptGeneration as jest.MockedFunction<
      typeof sGetPublicTemplateDataForPromptGeneration
   >;

describe("getPublicPromptsPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("error - test", async () => {
      const errorMessage = "db error";
      const error = new Error(errorMessage);
      sGetPublicTemplateDescriptorsPageMock.mockRejectedValue(error);

      const query = dtestData.dPromptsPageQuery();
      const result = await getPublicPromptsPage(query);

      expect(result).toEqual(EMPTY_PAGE);
      expect(sGetPublicTemplateDescriptorsPageMock).toHaveBeenCalledTimes(1);
      expect(sGetPublicTemplateDescriptorsPageMock).toHaveBeenCalledWith(query);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("prompts retrieved - test", async () => {
      const page = dtestData.dPromptsPage();
      sGetPublicTemplateDescriptorsPageMock.mockResolvedValue(page);

      const query = dtestData.dPromptsPageQuery();

      const result = await getPublicPromptsPage(query);

      expect(result).toEqual(page);
      expect(sGetPublicTemplateDescriptorsPageMock).toHaveBeenCalledTimes(1);
      expect(sGetPublicTemplateDescriptorsPageMock).toHaveBeenCalledWith(query);
   });
});

describe("getPublicPrompt tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const result = await getPublicPrompt(invalidId);

      expect(result).toBeNull();
      expect(sGetPublicTemplateDescriptorMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith("Invalid Descriptor ID.");
   });

   it("error - test", async () => {
      const errorMessage = "db error";
      const error = new Error(errorMessage);
      sGetPublicTemplateDescriptorMock.mockRejectedValue(error);

      const descriptorId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPublicPrompt(descriptorId);

      expect(result).toBeNull();
      expect(sGetPublicTemplateDescriptorMock).toHaveBeenCalledTimes(1);
      expect(sGetPublicTemplateDescriptorMock).toHaveBeenCalledWith(
         descriptorId
      );
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("prompt null - test", async () => {
      sGetPublicTemplateDescriptorMock.mockResolvedValue(null);

      const descriptorId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPublicPrompt(descriptorId);

      expect(result).toBeNull();
      expect(sGetPublicTemplateDescriptorMock).toHaveBeenCalledTimes(1);
      expect(sGetPublicTemplateDescriptorMock).toHaveBeenCalledWith(
         descriptorId
      );
   });

   it("prompt defined - test", async () => {
      const descriptor = dtestData.dPrompt();
      sGetPublicTemplateDescriptorMock.mockResolvedValue(descriptor);

      const descriptorId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPublicPrompt(descriptorId);

      expect(result).toEqual(descriptor);
      expect(sGetPublicTemplateDescriptorMock).toHaveBeenCalledTimes(1);
      expect(sGetPublicTemplateDescriptorMock).toHaveBeenCalledWith(
         descriptorId
      );
   });
});

describe("getPublicPromptContent tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const result = await getPublicPromptContent(invalidId);

      expect(result).toBeNull();
      expect(sGetPublicPromptTemplateMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith("Invalid Template ID.");
   });

   it("error - test", async () => {
      const errorMessage = "db error";
      const error = new Error(errorMessage);
      sGetPublicPromptTemplateMock.mockRejectedValue(error);

      const templateId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPublicPromptContent(templateId);

      expect(result).toBeNull();
      expect(sGetPublicPromptTemplateMock).toHaveBeenCalledTimes(1);
      expect(sGetPublicPromptTemplateMock).toHaveBeenCalledWith(templateId);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("promptContent null - test", async () => {
      sGetPublicPromptTemplateMock.mockResolvedValue(null);

      const templateId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPublicPromptContent(templateId);

      expect(result).toBeNull();
      expect(sGetPublicPromptTemplateMock).toHaveBeenCalledTimes(1);
      expect(sGetPublicPromptTemplateMock).toHaveBeenCalledWith(templateId);
   });

   it("promptContent defined - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      sGetPublicPromptTemplateMock.mockResolvedValue(prompt);

      const templateId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPublicPromptContent(templateId);

      expect(result).toEqual(prompt);
      expect(sGetPublicPromptTemplateMock).toHaveBeenCalledTimes(1);
      expect(sGetPublicPromptTemplateMock).toHaveBeenCalledWith(templateId);
   });
});

describe("getPublicPromptGenerationData tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const result = await getPublicPromptGenerationData(invalidId);

      expect(result).toBeNull();
      expect(
         sGetPublicTemplateDataForPromptGenerationMock
      ).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith("Invalid Descriptor ID.");
   });

   it("error - test", async () => {
      const errorMessage = "db error";
      const error = new Error(errorMessage);
      sGetPublicTemplateDataForPromptGenerationMock.mockRejectedValue(error);

      const templateId = "afa27716-b1e5-4db9-86bc-0efb890ff5d9";
      const result = await getPublicPromptGenerationData(templateId);

      expect(result).toEqual(null);
      expect(
         sGetPublicTemplateDataForPromptGenerationMock
      ).toHaveBeenCalledTimes(1);
      expect(
         sGetPublicTemplateDataForPromptGenerationMock
      ).toHaveBeenCalledWith(templateId);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("data retrieved - test", async () => {
      const data = dtestData.dPromptGenerationData();
      sGetPublicTemplateDataForPromptGenerationMock.mockResolvedValue(data);

      const templateId = "afa27716-b1e5-4db9-86bc-0efb890ff5d9";
      const result = await getPublicPromptGenerationData(templateId);

      expect(result).toEqual(data);
      expect(
         sGetPublicTemplateDataForPromptGenerationMock
      ).toHaveBeenCalledTimes(1);
      expect(
         sGetPublicTemplateDataForPromptGenerationMock
      ).toHaveBeenCalledWith(templateId);
   });
});

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

const sGetPublicPromptsPage =
   PublicPromptService.prototype.getPublicPromptsPage;
const sGetPublicPrompt = PublicPromptService.prototype.getPublicPrompt;
const sGetPublicPromptContent =
   PublicPromptService.prototype.getPublicPromptContent;
const sGetPublicPromptGenerationData =
   PublicPromptService.prototype.getPublicPromptGenerationData;

const sGetPublicPromptsPageMock = sGetPublicPromptsPage as jest.MockedFunction<
   typeof sGetPublicPromptsPage
>;
const sGetPublicPromptMock = sGetPublicPrompt as jest.MockedFunction<
   typeof sGetPublicPrompt
>;
const sGetPublicPromptContentMock =
   sGetPublicPromptContent as jest.MockedFunction<
      typeof sGetPublicPromptContent
   >;
const sGetPublicPromptGenerationDataMock =
   sGetPublicPromptGenerationData as jest.MockedFunction<
      typeof sGetPublicPromptGenerationData
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
      sGetPublicPromptsPageMock.mockRejectedValue(error);

      const query = dtestData.dPromptsPageQuery();
      const result = await getPublicPromptsPage(query);

      expect(result).toEqual(EMPTY_PAGE);
      expect(sGetPublicPromptsPageMock).toHaveBeenCalledTimes(1);
      expect(sGetPublicPromptsPageMock).toHaveBeenCalledWith(query);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("prompts retrieved - test", async () => {
      const page = dtestData.dPromptsPage();
      sGetPublicPromptsPageMock.mockResolvedValue(page);

      const query = dtestData.dPromptsPageQuery();

      const result = await getPublicPromptsPage(query);

      expect(result).toEqual(page);
      expect(sGetPublicPromptsPageMock).toHaveBeenCalledTimes(1);
      expect(sGetPublicPromptsPageMock).toHaveBeenCalledWith(query);
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
      expect(sGetPublicPromptMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith("Invalid Descriptor ID.");
   });

   it("error - test", async () => {
      const errorMessage = "db error";
      const error = new Error(errorMessage);
      sGetPublicPromptMock.mockRejectedValue(error);

      const descriptorId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPublicPrompt(descriptorId);

      expect(result).toBeNull();
      expect(sGetPublicPromptMock).toHaveBeenCalledTimes(1);
      expect(sGetPublicPromptMock).toHaveBeenCalledWith(descriptorId);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("prompt null - test", async () => {
      sGetPublicPromptMock.mockResolvedValue(null);

      const descriptorId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPublicPrompt(descriptorId);

      expect(result).toBeNull();
      expect(sGetPublicPromptMock).toHaveBeenCalledTimes(1);
      expect(sGetPublicPromptMock).toHaveBeenCalledWith(descriptorId);
   });

   it("prompt defined - test", async () => {
      const descriptor = dtestData.dPrompt();
      sGetPublicPromptMock.mockResolvedValue(descriptor);

      const descriptorId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPublicPrompt(descriptorId);

      expect(result).toEqual(descriptor);
      expect(sGetPublicPromptMock).toHaveBeenCalledTimes(1);
      expect(sGetPublicPromptMock).toHaveBeenCalledWith(descriptorId);
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
      expect(sGetPublicPromptContentMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith("Invalid Template ID.");
   });

   it("error - test", async () => {
      const errorMessage = "db error";
      const error = new Error(errorMessage);
      sGetPublicPromptContentMock.mockRejectedValue(error);

      const templateId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPublicPromptContent(templateId);

      expect(result).toBeNull();
      expect(sGetPublicPromptContentMock).toHaveBeenCalledTimes(1);
      expect(sGetPublicPromptContentMock).toHaveBeenCalledWith(templateId);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("promptContent null - test", async () => {
      sGetPublicPromptContentMock.mockResolvedValue(null);

      const templateId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPublicPromptContent(templateId);

      expect(result).toBeNull();
      expect(sGetPublicPromptContentMock).toHaveBeenCalledTimes(1);
      expect(sGetPublicPromptContentMock).toHaveBeenCalledWith(templateId);
   });

   it("promptContent defined - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      sGetPublicPromptContentMock.mockResolvedValue(prompt);

      const templateId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPublicPromptContent(templateId);

      expect(result).toEqual(prompt);
      expect(sGetPublicPromptContentMock).toHaveBeenCalledTimes(1);
      expect(sGetPublicPromptContentMock).toHaveBeenCalledWith(templateId);
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
      expect(sGetPublicPromptGenerationDataMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith("Invalid Descriptor ID.");
   });

   it("error - test", async () => {
      const errorMessage = "db error";
      const error = new Error(errorMessage);
      sGetPublicPromptGenerationDataMock.mockRejectedValue(error);

      const templateId = "afa27716-b1e5-4db9-86bc-0efb890ff5d9";
      const result = await getPublicPromptGenerationData(templateId);

      expect(result).toEqual(null);
      expect(sGetPublicPromptGenerationDataMock).toHaveBeenCalledTimes(1);
      expect(sGetPublicPromptGenerationDataMock).toHaveBeenCalledWith(
         templateId
      );
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("data retrieved - test", async () => {
      const data = dtestData.dPromptTemplatingData();
      sGetPublicPromptGenerationDataMock.mockResolvedValue(data);

      const templateId = "afa27716-b1e5-4db9-86bc-0efb890ff5d9";
      const result = await getPublicPromptGenerationData(templateId);

      expect(result).toEqual(data);
      expect(sGetPublicPromptGenerationDataMock).toHaveBeenCalledTimes(1);
      expect(sGetPublicPromptGenerationDataMock).toHaveBeenCalledWith(
         templateId
      );
   });
});

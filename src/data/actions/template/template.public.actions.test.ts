jest.mock("@/data/services/template");

import { dtestData } from "@tests";

import { EMPTY_PAGE } from "@/data/actions/utils";
import { PublicTemplateService } from "@/data/services/template";

import {
   getPublicPromptGenerationTemplateData,
   getPublicTemplateDescriptorsPage,
} from "./template.public.actions";

const sGetPublicTemplateDescriptorsPage =
   PublicTemplateService.prototype.getPublicTemplateDescriptorsPage;
const sGetPublicTemplateDataForPromptGeneration =
   PublicTemplateService.prototype.getPublicTemplateDataForPromptGeneration;

const sGetPublicTemplateDescriptorsPageMock =
   sGetPublicTemplateDescriptorsPage as jest.MockedFunction<
      typeof sGetPublicTemplateDescriptorsPage
   >;

const sGetPublicTemplateDataForPromptGenerationMock =
   sGetPublicTemplateDataForPromptGeneration as jest.MockedFunction<
      typeof sGetPublicTemplateDataForPromptGeneration
   >;

describe("getPublicTemplateDescriptorsPage tests", () => {
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

      const query = dtestData.dTemplateDescriptorsPageQuery();
      const result = await getPublicTemplateDescriptorsPage(query);

      expect(result).toEqual(EMPTY_PAGE);
      expect(sGetPublicTemplateDescriptorsPageMock).toHaveBeenCalledTimes(1);
      expect(sGetPublicTemplateDescriptorsPageMock).toHaveBeenCalledWith(query);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("descriptors retrieved - test", async () => {
      const page = dtestData.dTemplateDescriptorsPage();
      sGetPublicTemplateDescriptorsPageMock.mockResolvedValue(page);

      const query = dtestData.dTemplateDescriptorsPageQuery();

      const result = await getPublicTemplateDescriptorsPage(query);

      expect(result).toEqual(page);
      expect(sGetPublicTemplateDescriptorsPageMock).toHaveBeenCalledTimes(1);
      expect(sGetPublicTemplateDescriptorsPageMock).toHaveBeenCalledWith(query);
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

   it("error - test", async () => {
      const errorMessage = "db error";
      const error = new Error(errorMessage);
      sGetPublicTemplateDataForPromptGenerationMock.mockRejectedValue(error);

      const templateId = "prompt-template-id";
      const result = await getPublicPromptGenerationTemplateData(templateId);

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
      const data = dtestData.dPromptTemplateDataPromptGeneration();
      sGetPublicTemplateDataForPromptGenerationMock.mockResolvedValue(data);

      const templateId = "prompt-template-id";
      const result = await getPublicPromptGenerationTemplateData(templateId);

      expect(result).toEqual(data);
      expect(
         sGetPublicTemplateDataForPromptGenerationMock
      ).toHaveBeenCalledTimes(1);
      expect(
         sGetPublicTemplateDataForPromptGenerationMock
      ).toHaveBeenCalledWith(templateId);
   });
});

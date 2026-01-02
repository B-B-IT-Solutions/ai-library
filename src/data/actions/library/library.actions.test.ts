jest.mock("@/data/services/library");

import { dtestData } from "@tests";

import { LibraryService } from "@/data/services/library";

import {
   copyTemplateToPrompts,
   downloadTemplate,
   getLibraryEntries,
} from "./library.actions";

const sGetLibraryEntries = LibraryService.prototype.getLibraryEntries;
const sCopyTemplateToPrompts = LibraryService.prototype.copyTemplateToPrompts;
const sDownloadTemplate = LibraryService.prototype.downloadTemplate;

const sGetLibraryEntriesMock = sGetLibraryEntries as jest.MockedFunction<
   typeof sGetLibraryEntries
>;
const sCopyTemplateToPromptsMock =
   sCopyTemplateToPrompts as jest.MockedFunction<typeof sCopyTemplateToPrompts>;
const sDownloadTemplateMock = sDownloadTemplate as jest.MockedFunction<
   typeof sDownloadTemplate
>;

describe("getLibraryEntries tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getLibraryEntries - entries retrieved - test", async () => {
      const entries = dtestData.dLibraryEntries();
      sGetLibraryEntriesMock.mockResolvedValue(entries);

      const result = await getLibraryEntries();

      expect(result).toEqual(entries);
      expect(sGetLibraryEntriesMock).toHaveBeenCalledTimes(1);
   });
});

describe("copyTemplateToPrompts tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("copyTemplateToPrompts - success - test", async () => {
      const templateId = "template-id-1";
      sCopyTemplateToPromptsMock.mockResolvedValue(undefined);

      const result = await copyTemplateToPrompts(templateId);
      const expectedResult = {
         success: true,
         message: "Template copied to your prompts successfully!",
      };

      expect(result).toEqual(expectedResult);
      expect(sCopyTemplateToPromptsMock).toHaveBeenCalledTimes(1);
      expect(sCopyTemplateToPromptsMock).toHaveBeenCalledWith(templateId);
   });

   it("copyTemplateToPrompts - error - test", async () => {
      const templateId = "template-id-1";
      const errorMessage = "Database error";
      const error = new Error(errorMessage);
      sCopyTemplateToPromptsMock.mockRejectedValue(error);

      const result = await copyTemplateToPrompts(templateId);
      const expectedResult = {
         success: false,
         message: errorMessage,
      };

      expect(result).toEqual(expectedResult);
      expect(sCopyTemplateToPromptsMock).toHaveBeenCalledTimes(1);
      expect(sCopyTemplateToPromptsMock).toHaveBeenCalledWith(templateId);
   });
});

describe("downloadTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("downloadTemplate - success - test", async () => {
      const templateId = "template-id-1";
      const downloadData = "template content data";
      sDownloadTemplateMock.mockResolvedValue(downloadData);

      const result = await downloadTemplate(templateId);
      const expectedResult = {
         success: true,
         message: "Template ready for download.",
         data: downloadData,
      };

      expect(result).toEqual(expectedResult);
      expect(sDownloadTemplateMock).toHaveBeenCalledTimes(1);
      expect(sDownloadTemplateMock).toHaveBeenCalledWith(templateId);
   });

   it("downloadTemplate - error - test", async () => {
      const templateId = "template-id-1";
      const errorMessage = "Template not found";
      const error = new Error(errorMessage);
      sDownloadTemplateMock.mockRejectedValue(error);

      const result = await downloadTemplate(templateId);
      const expectedResult = {
         success: false,
         message: errorMessage,
      };

      expect(result).toEqual(expectedResult);
      expect(sDownloadTemplateMock).toHaveBeenCalledTimes(1);
      expect(sDownloadTemplateMock).toHaveBeenCalledWith(templateId);
   });
});

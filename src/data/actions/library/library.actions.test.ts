jest.mock("@/data/services/library");

import { dtestData } from "@tests";

import { LibraryService } from "@/data/services/library";

import {
   createPromptFromTemplate,
   downloadTemplate,
   getLibraryEntries,
   getLibraryEntry,
} from "./library.actions";

const sGetLibraryEntries = LibraryService.prototype.getLibraryEntries;
const sgetLibraryEntry = LibraryService.prototype.getLibraryEntry;
const sCreatePromptFromTemplate =
   LibraryService.prototype.createPromptFromTemplate;
const sDownloadTemplate = LibraryService.prototype.downloadPromptTemplate;

const sGetLibraryEntriesMock = sGetLibraryEntries as jest.MockedFunction<
   typeof sGetLibraryEntries
>;
const sgetLibraryEntryMock = sgetLibraryEntry as jest.MockedFunction<
   typeof sgetLibraryEntry
>;
const sCreatePromptFromTemplateMock =
   sCreatePromptFromTemplate as jest.MockedFunction<
      typeof sCreatePromptFromTemplate
   >;
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

describe("getLibraryEntry tests", () => {
   const originalConsoleError = console.error;

   beforeEach(() => {
      jest.clearAllMocks();
      console.error = jest.fn();
   });

   afterEach(() => {
      console.error = originalConsoleError;
   });

   it("getLibraryEntry - error - test", async () => {
      const errorMessage = "db error";
      const error = new Error(errorMessage);
      sgetLibraryEntryMock.mockRejectedValue(error);
      const entryId = "a34e7e08-1806-419e-8f03-2e36a4f5466e";

      const result = await getLibraryEntry(entryId);

      expect(result).toBeNull();
      expect(sgetLibraryEntryMock).toHaveBeenCalledTimes(1);
      expect(sgetLibraryEntryMock).toHaveBeenCalledWith(entryId);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(errorMessage);
   });

   it("getLibraryEntry - entry null - test", async () => {
      sgetLibraryEntryMock.mockResolvedValue(null);
      const entryId = "a34e7e08-1806-419e-8f03-2e36a4f5466e";

      const result = await getLibraryEntry(entryId);

      expect(result).toBeNull();
      expect(sgetLibraryEntryMock).toHaveBeenCalledTimes(1);
      expect(sgetLibraryEntryMock).toHaveBeenCalledWith(entryId);
   });

   it("getLibraryEntry - entry retrieved - test", async () => {
      const entry = dtestData.dLibraryEntry();
      sgetLibraryEntryMock.mockResolvedValue(entry);
      const entryId = "a34e7e08-1806-419e-8f03-2e36a4f5466e";

      const result = await getLibraryEntry(entryId);

      expect(result).toEqual(entry);
      expect(sgetLibraryEntryMock).toHaveBeenCalledTimes(1);
      expect(sgetLibraryEntryMock).toHaveBeenCalledWith(entryId);
   });
});

describe("createPromptFromTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("createPromptFromTemplate - success - test", async () => {
      const templateId = "template-id-1";
      sCreatePromptFromTemplateMock.mockResolvedValue(undefined);

      const result = await createPromptFromTemplate(templateId);
      const expectedResult = {
         success: true,
         message: "Template copied to your prompts successfully!",
      };

      expect(result).toEqual(expectedResult);
      expect(sCreatePromptFromTemplateMock).toHaveBeenCalledTimes(1);
      expect(sCreatePromptFromTemplateMock).toHaveBeenCalledWith(templateId);
   });

   it("createPromptFromTemplate - error - test", async () => {
      const templateId = "template-id-1";
      const errorMessage = "Database error";
      const error = new Error(errorMessage);
      sCreatePromptFromTemplateMock.mockRejectedValue(error);

      const result = await createPromptFromTemplate(templateId);
      const expectedResult = {
         success: false,
         message: errorMessage,
      };

      expect(result).toEqual(expectedResult);
      expect(sCreatePromptFromTemplateMock).toHaveBeenCalledTimes(1);
      expect(sCreatePromptFromTemplateMock).toHaveBeenCalledWith(templateId);
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

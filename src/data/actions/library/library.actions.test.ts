jest.mock("@/data/services/library");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";

import { LibraryService } from "@/data/services/library";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import { DPromptTemplateFieldValues } from "@/data/types/domain/prompt.template";
import { ActionResult } from "@/data/types/utils";
import { requireUser } from "../auth-utils";

import {
   composePromptFromTemplate,
   downloadTemplate,
   getLibraryEntries,
   getLibraryEntry,
} from "./library.actions";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const sGetLibraryEntries = LibraryService.prototype.getLibraryEntries;
const sgetLibraryEntry = LibraryService.prototype.getLibraryEntry;
const sComposePromptFromTemplate =
   LibraryService.prototype.composePromptFromTemplate;
const sDownloadTemplate = LibraryService.prototype.downloadPromptTemplate;

const sGetLibraryEntriesMock = sGetLibraryEntries as jest.MockedFunction<
   typeof sGetLibraryEntries
>;
const sgetLibraryEntryMock = sgetLibraryEntry as jest.MockedFunction<
   typeof sgetLibraryEntry
>;
const sComposePromptFromTemplateMock =
   sComposePromptFromTemplate as jest.MockedFunction<
      typeof sComposePromptFromTemplate
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
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
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
      const entry = dtestData.dLibraryEntryWithPromptTemplate();
      sgetLibraryEntryMock.mockResolvedValue(entry);
      const entryId = "a34e7e08-1806-419e-8f03-2e36a4f5466e";

      const result = await getLibraryEntry(entryId);

      expect(result).toEqual(entry);
      expect(sgetLibraryEntryMock).toHaveBeenCalledTimes(1);
      expect(sgetLibraryEntryMock).toHaveBeenCalledWith(entryId);
   });
});

describe("composePromptFromTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("composePromptFromTemplate - invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";
      const fieldValues: DPromptTemplateFieldValues = { field1: "value1" };

      const result = await composePromptFromTemplate(invalidId, fieldValues);

      const expectedResult: ActionResult = {
         success: false,
         message: "Invalid template ID.",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sComposePromptFromTemplateMock).not.toHaveBeenCalled();
   });

   it("composePromptFromTemplate - user undefined - test", async () => {
      const error = new Error("Unknow user");
      const templateId = "123e4567-e89b-12d3-a456-426614174000";
      const fieldValues: DPromptTemplateFieldValues = { field1: "value1" };
      requireUserMock.mockRejectedValue(error);

      const result = await composePromptFromTemplate(templateId, fieldValues);
      const expectedResult: ActionResult = {
         success: false,
         message: "Unknow user",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sComposePromptFromTemplateMock).not.toHaveBeenCalled();
   });

   it("composePromptFromTemplate - success - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const templateId = "123e4567-e89b-12d3-a456-426614174000";
      const fieldValues: DPromptTemplateFieldValues = {
         name: "User-1 Name",
         email: "test1@email.com",
         age: 30,
      };
      const promptData = dtestData.dPromptUpdate();
      sComposePromptFromTemplateMock.mockResolvedValue(promptData);

      const result = await composePromptFromTemplate(templateId, fieldValues);
      const expectedResult: ActionResult<DPromptUpdate> = {
         success: true,
         message: "Prompt erfolgreich generiert",
         data: promptData,
      };

      expect(result).toEqual(expectedResult);
      expect(sComposePromptFromTemplateMock).toHaveBeenCalledTimes(1);
      expect(sComposePromptFromTemplateMock).toHaveBeenCalledWith(
         templateId,
         fieldValues,
         user.id
      );
   });

   it("composePromptFromTemplate - error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const templateId = "123e4567-e89b-12d3-a456-426614174000";
      const fieldValues: DPromptTemplateFieldValues = {
         name: "User-1 Name",
         email: "invalid-email",
      };
      const errorMessage = "Provided template fields are invalid";
      const error = new Error(errorMessage);
      sComposePromptFromTemplateMock.mockRejectedValue(error);

      const result = await composePromptFromTemplate(templateId, fieldValues);
      const expectedResult: ActionResult = {
         success: false,
         message: errorMessage,
      };

      expect(result).toEqual(expectedResult);
      expect(sComposePromptFromTemplateMock).toHaveBeenCalledTimes(1);
      expect(sComposePromptFromTemplateMock).toHaveBeenCalledWith(
         templateId,
         fieldValues,
         user.id
      );
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

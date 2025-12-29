jest.mock("@/data/services/library");

import { dtestData } from "@tests";

import { LibraryService } from "@/data/services/library";

import {
   copyTemplateToPrompts,
   downloadTemplate,
   getLibraryEntries,
   hasAccessToTemplate,
} from "./library.actions";

const sGetLibraryEntries = LibraryService.prototype.getLibraryEntries;
const sHasAccessToTemplate = LibraryService.prototype.hasAccessToTemplate;
const sCopyTemplateToPrompts = LibraryService.prototype.copyTemplateToPrompts;
const sDownloadTemplate = LibraryService.prototype.downloadTemplate;

const sGetLibraryEntriesMock = sGetLibraryEntries as jest.MockedFunction<
   typeof sGetLibraryEntries
>;
const sHasAccessToTemplateMock = sHasAccessToTemplate as jest.MockedFunction<
   typeof sHasAccessToTemplate
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

describe("hasAccessToTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("hasAccessToTemplate  test", async () => {
      const templateId = "template-id-1";
      const expectedResult = true;
      sHasAccessToTemplateMock.mockResolvedValue(expectedResult);

      const result = await hasAccessToTemplate(templateId);

      expect(result).toEqual(expectedResult);
      expect(sHasAccessToTemplateMock).toHaveBeenCalledTimes(1);
      expect(sHasAccessToTemplateMock).toHaveBeenCalledWith(templateId);
   });
});

describe("copyTemplateToPrompts tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("copyTemplateToPrompts  test", async () => {
      const templateId = "template-id-1";

      await copyTemplateToPrompts(templateId);

      expect(sCopyTemplateToPromptsMock).toHaveBeenCalledTimes(1);
      expect(sCopyTemplateToPromptsMock).toHaveBeenCalledWith(templateId);
   });
});

describe("downloadTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("downloadTemplate  test", async () => {
      const templateId = "template-id-1";

      await downloadTemplate(templateId);

      expect(sDownloadTemplateMock).toHaveBeenCalledTimes(1);
      expect(sDownloadTemplateMock).toHaveBeenCalledWith(templateId);
   });
});

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

jest.mock("@/data/services/prompt-template");

import { dtestData } from "@tests";

import { EMPTY_PAGE } from "@/data/actions/utils";
import { PublicTemplateService } from "@/data/services/prompt-template";

import { getPublicTemplateDescriptorsPage } from "./template.public.actions";

const sGetPublicTemplateDescriptorsPage =
   PublicTemplateService.prototype.getPublicTemplateDescriptorsPage;

const sGetPublicTemplateDescriptorsPageMock =
   sGetPublicTemplateDescriptorsPage as jest.MockedFunction<
      typeof sGetPublicTemplateDescriptorsPage
   >;

describe("getPublicTemplateDescriptorsPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("db error - test", async () => {
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

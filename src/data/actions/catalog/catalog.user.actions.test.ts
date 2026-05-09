jest.mock("@/data/services/catalog");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";

import { requireUser } from "@/data/actions/auth-utils";
import { CatalogService } from "@/data/services/catalog";
import { DCatalogEntryCopyResult } from "@/data/types/domain/catalog";
import { ActionResult } from "@/data/types/utils";

import { addCatalogEntryToUserTemplates } from "./catalog.user.actions";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const sCopyCatalogEntryToUserTemplates =
   CatalogService.prototype.copyCatalogEntryToUserTemplates;

const sCopyCatalogEntryToUserTemplatesMock =
   sCopyCatalogEntryToUserTemplates as jest.MockedFunction<
      typeof sCopyCatalogEntryToUserTemplates
   >;

describe("addCatalogEntryToUserTemplates tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const result = await addCatalogEntryToUserTemplates(invalidId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Vorlage konnte nicht übernommen werden.",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sCopyCatalogEntryToUserTemplatesMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith("Invalid CatalogEntry ID.");
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const catalogEntryId = "ffc685b5-832b-42b6-b995-830e26b62f35";

      const result = await addCatalogEntryToUserTemplates(catalogEntryId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Vorlage konnte nicht übernommen werden.",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCopyCatalogEntryToUserTemplatesMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("service error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("DB Error");
      sCopyCatalogEntryToUserTemplatesMock.mockRejectedValue(error);

      const catalogEntryId = "ffc685b5-832b-42b6-b995-830e26b62f35";

      const result = await addCatalogEntryToUserTemplates(catalogEntryId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Vorlage konnte nicht übernommen werden.",
      };

      expect(result).toEqual(expectedResult);
      expect(sCopyCatalogEntryToUserTemplatesMock).toHaveBeenCalledTimes(1);
      expect(sCopyCatalogEntryToUserTemplatesMock).toHaveBeenCalledWith(
         user.id,
         catalogEntryId
      );
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("success - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const descriptor = dtestData.dPromptTemplateDescriptor();
      sCopyCatalogEntryToUserTemplatesMock.mockResolvedValue(descriptor);

      const catalogEntryId = "ffc685b5-832b-42b6-b995-830e26b62f35";
      const result = await addCatalogEntryToUserTemplates(catalogEntryId);

      const expectedResult: ActionResult<DCatalogEntryCopyResult> = {
         success: true,
         message: "Vorlage erfolgreich übernommen.",
         data: {
            templateId: descriptor.id,
         },
      };

      expect(result).toEqual(expectedResult);

      expect(sCopyCatalogEntryToUserTemplatesMock).toHaveBeenCalledTimes(1);
      expect(sCopyCatalogEntryToUserTemplatesMock).toHaveBeenCalledWith(
         user.id,
         catalogEntryId
      );
   });
});

jest.mock("@/data/services/catalog");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";

import { requireUser } from "@/data/actions/auth-utils";
import { CatalogService } from "@/data/services/catalog";
import { DCatalogEntryCopyResult } from "@/data/types/domain/catalog";
import { ActionResult } from "@/data/types/utils";

import { addCatalogEntryToUserPrompts } from "./catalog.user.actions";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const sAddCatalogEntryToUserPrompts =
   CatalogService.prototype.addCatalogEntryToUserPrompts;

const sAddCatalogEntryToUserPromptsMock =
   sAddCatalogEntryToUserPrompts as jest.MockedFunction<
      typeof sAddCatalogEntryToUserPrompts
   >;

describe("addCatalogEntryToUserPrompts tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const result = await addCatalogEntryToUserPrompts(invalidId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Vorlage konnte nicht übernommen werden.",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sAddCatalogEntryToUserPromptsMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith("Invalid CatalogEntry ID.");
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const catalogEntryId = "ffc685b5-832b-42b6-b995-830e26b62f35";

      const result = await addCatalogEntryToUserPrompts(catalogEntryId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Vorlage konnte nicht übernommen werden.",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sAddCatalogEntryToUserPromptsMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("service error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("DB Error");
      sAddCatalogEntryToUserPromptsMock.mockRejectedValue(error);

      const catalogEntryId = "ffc685b5-832b-42b6-b995-830e26b62f35";

      const result = await addCatalogEntryToUserPrompts(catalogEntryId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Vorlage konnte nicht übernommen werden.",
      };

      expect(result).toEqual(expectedResult);
      expect(sAddCatalogEntryToUserPromptsMock).toHaveBeenCalledTimes(1);
      expect(sAddCatalogEntryToUserPromptsMock).toHaveBeenCalledWith(
         user.id,
         catalogEntryId
      );
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("success - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const descriptor = dtestData.dPrompt();
      sAddCatalogEntryToUserPromptsMock.mockResolvedValue(descriptor);

      const catalogEntryId = "ffc685b5-832b-42b6-b995-830e26b62f35";
      const result = await addCatalogEntryToUserPrompts(catalogEntryId);

      const expectedResult: ActionResult<DCatalogEntryCopyResult> = {
         success: true,
         message: "Vorlage erfolgreich übernommen.",
         data: {
            templateId: descriptor.id,
         },
      };

      expect(result).toEqual(expectedResult);

      expect(sAddCatalogEntryToUserPromptsMock).toHaveBeenCalledTimes(1);
      expect(sAddCatalogEntryToUserPromptsMock).toHaveBeenCalledWith(
         user.id,
         catalogEntryId
      );
   });
});

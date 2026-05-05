jest.mock("@/data/services/catalog");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";

import { requireUser } from "@/data/actions/auth-utils";
import { CatalogService } from "@/data/services/catalog";
import { DCatalogEntryCopyResult } from "@/data/types/domain/catalog";
import { ActionResult } from "@/data/types/utils";
import { EMPTY_PAGE } from "../utils";

import {
   copyCatalogEntryToUserTemplates,
   getCatalogEntryCategories,
   getPublishedCatalogEntriesPage,
   getPublishedCatalogEntryBySlug,
} from "./catalog.actions";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const sGetPublishedEntriesPage =
   CatalogService.prototype.getPublishedCatalogEntriesPage;
const sGetPublishedEntryBySlug =
   CatalogService.prototype.getPublishedCatalogEntryBySlug;
const sGetCatalogEntryCategories =
   CatalogService.prototype.getCatalogEntryCategories;
const sCopyCatalogEntryToUserTemplates =
   CatalogService.prototype.copyCatalogEntryToUserTemplates;

const sGetPublishedEntriesPageMock =
   sGetPublishedEntriesPage as jest.MockedFunction<
      typeof sGetPublishedEntriesPage
   >;
const sGetPublishedEntryBySlugMock =
   sGetPublishedEntryBySlug as jest.MockedFunction<
      typeof sGetPublishedEntryBySlug
   >;
const sGetCatalogEntryCategoriesMock =
   sGetCatalogEntryCategories as jest.MockedFunction<
      typeof sGetCatalogEntryCategories
   >;
const sCopyCatalogEntryToUserTemplatesMock =
   sCopyCatalogEntryToUserTemplates as jest.MockedFunction<
      typeof sCopyCatalogEntryToUserTemplates
   >;

describe("getPublishedCatalogEntriesPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("service error - test", async () => {
      const error = new Error("DB error");
      sGetPublishedEntriesPageMock.mockRejectedValue(error);

      const result = await getPublishedCatalogEntriesPage();

      expect(result).toEqual(EMPTY_PAGE);
      expect(sGetPublishedEntriesPageMock).toHaveBeenCalledTimes(1);
      expect(sGetPublishedEntriesPageMock).toHaveBeenCalledWith(undefined);
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("success - query undefinend - test", async () => {
      const page = dtestData.dCatalogEntriesPage();
      sGetPublishedEntriesPageMock.mockResolvedValue(page);

      const result = await getPublishedCatalogEntriesPage();

      expect(result).toEqual(page);
      expect(sGetPublishedEntriesPageMock).toHaveBeenCalledTimes(1);
      expect(sGetPublishedEntriesPageMock).toHaveBeenCalledWith(undefined);
   });

   it("success - query definend - test", async () => {
      const page = dtestData.dCatalogEntriesPage();
      sGetPublishedEntriesPageMock.mockResolvedValue(page);

      const query = dtestData.dCatalogEntriesPageQuery();
      const result = await getPublishedCatalogEntriesPage(query);

      expect(result).toEqual(page);
      expect(sGetPublishedEntriesPageMock).toHaveBeenCalledTimes(1);
      expect(sGetPublishedEntriesPageMock).toHaveBeenCalledWith(query);
   });
});

describe("getPublishedCatalogEntryBySlug tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("service error - test", async () => {
      const error = new Error("Not found");
      sGetPublishedEntryBySlugMock.mockRejectedValue(error);

      const slug = "valid-slug";
      const result = await getPublishedCatalogEntryBySlug(slug);

      expect(result).toBeNull();
      expect(sGetPublishedEntryBySlugMock).toHaveBeenCalledTimes(1);
      expect(sGetPublishedEntryBySlugMock).toHaveBeenCalledWith(slug);
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("slug - empty - test", async () => {
      const slug = "";
      const result = await getPublishedCatalogEntryBySlug(slug);

      expect(result).toBeNull();
      expect(sGetPublishedEntryBySlugMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("slug - whitespace - test", async () => {
      const slug = "   ";
      const result = await getPublishedCatalogEntryBySlug(slug);

      expect(result).toBeNull();
      expect(sGetPublishedEntryBySlugMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("slug - valid - test", async () => {
      const entry = dtestData.dCatalogEntry();
      sGetPublishedEntryBySlugMock.mockResolvedValue(entry);

      const slug = "catalog-entry-1";
      const result = await getPublishedCatalogEntryBySlug(slug);

      expect(result).toEqual(entry);
      expect(sGetPublishedEntryBySlugMock).toHaveBeenCalledTimes(1);
      expect(sGetPublishedEntryBySlugMock).toHaveBeenCalledWith(slug);
   });
});

describe("sGetCatalogEntryCategoriesMock tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("service error - test", async () => {
      const error = new Error("DB error");
      sGetCatalogEntryCategoriesMock.mockRejectedValue(error);

      const result = await getCatalogEntryCategories();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("success - test", async () => {
      const categories = dtestData.dCatalogCategories();
      sGetCatalogEntryCategoriesMock.mockResolvedValue(categories);

      const result = await getCatalogEntryCategories();

      expect(result).toEqual(categories);
      expect(sGetCatalogEntryCategoriesMock).toHaveBeenCalledTimes(1);
   });
});

describe("copyCatalogEntryToUserLibrary tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const result = await copyCatalogEntryToUserTemplates(invalidId);

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

      const result = await copyCatalogEntryToUserTemplates(catalogEntryId);

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

      const result = await copyCatalogEntryToUserTemplates(catalogEntryId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Vorlage konnte nicht übernommen werden.",
      };

      expect(result).toEqual(expectedResult);
      expect(sCopyCatalogEntryToUserTemplatesMock).toHaveBeenCalledTimes(1);
      expect(sCopyCatalogEntryToUserTemplatesMock).toHaveBeenCalledWith(
         catalogEntryId,
         user.id
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
      const result = await copyCatalogEntryToUserTemplates(catalogEntryId);

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
         catalogEntryId,
         user.id
      );
   });
});

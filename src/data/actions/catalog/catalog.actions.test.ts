jest.mock("@/data/services/catalog");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";

import { requireUser } from "@/data/actions/auth-utils";
import { CatalogService } from "@/data/services/catalog";

import {
   copyCatalogEntryToUserLibrary,
   getCatalogCategories,
   getCatalogEntriesPage,
   getCatalogEntryBySlug,
} from "./catalog.actions";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const sGetPublishedEntriesPage = CatalogService.prototype.getPublishedEntriesPage;
const sGetPublishedEntryBySlug = CatalogService.prototype.getPublishedEntryBySlug;
const sGetCategories = CatalogService.prototype.getCategories;
const sCopyEntryToUserLibrary = CatalogService.prototype.copyEntryToUserLibrary;

const sGetPublishedEntriesPageMock = sGetPublishedEntriesPage as jest.MockedFunction<
   typeof sGetPublishedEntriesPage
>;
const sGetPublishedEntryBySlugMock = sGetPublishedEntryBySlug as jest.MockedFunction<
   typeof sGetPublishedEntryBySlug
>;
const sGetCategoriesMock = sGetCategories as jest.MockedFunction<
   typeof sGetCategories
>;
const sCopyEntryToUserLibraryMock = sCopyEntryToUserLibrary as jest.MockedFunction<
   typeof sCopyEntryToUserLibrary
>;

const CATALOG_EMPTY_PAGE = {
   content: [],
   pageNumber: 0,
   pageSize: 12,
   numberOfElements: 0,
   totalPages: 0,
   totalElements: 0,
};

describe("getCatalogEntriesPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getCatalogEntriesPage - success - returns page - test", async () => {
      const page = dtestData.dCatalogEntriesPage();
      sGetPublishedEntriesPageMock.mockResolvedValue(page);

      const result = await getCatalogEntriesPage();

      expect(result).toEqual(page);
      expect(sGetPublishedEntriesPageMock).toHaveBeenCalledTimes(1);
   });

   it("getCatalogEntriesPage - service error - returns empty page - test", async () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      sGetPublishedEntriesPageMock.mockRejectedValue(new Error("DB error"));

      const result = await getCatalogEntriesPage();

      expect(result).toEqual(CATALOG_EMPTY_PAGE);
      expect(console.error).toHaveBeenCalledTimes(1);

      jest.restoreAllMocks();
   });

   it("getCatalogEntriesPage - passes query to service - test", async () => {
      const query = dtestData.dCatalogEntriesPageQuery();
      const page = dtestData.dCatalogEntriesPage();
      sGetPublishedEntriesPageMock.mockResolvedValue(page);

      await getCatalogEntriesPage(query);

      expect(sGetPublishedEntriesPageMock).toHaveBeenCalledWith(query);
   });
});

describe("getCatalogEntryBySlug tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getCatalogEntryBySlug - valid slug - returns entry - test", async () => {
      const entry = dtestData.dCatalogEntry();
      sGetPublishedEntryBySlugMock.mockResolvedValue(entry);

      const result = await getCatalogEntryBySlug("catalog-entry-1");

      expect(result).toEqual(entry);
      expect(sGetPublishedEntryBySlugMock).toHaveBeenCalledWith("catalog-entry-1");
   });

   it("getCatalogEntryBySlug - empty slug - returns null without calling service - test", async () => {
      jest.spyOn(console, "error").mockImplementation(() => {});

      const result = await getCatalogEntryBySlug("");

      expect(result).toBeNull();
      expect(sGetPublishedEntryBySlugMock).not.toHaveBeenCalled();

      jest.restoreAllMocks();
   });

   it("getCatalogEntryBySlug - whitespace slug - returns null - test", async () => {
      jest.spyOn(console, "error").mockImplementation(() => {});

      const result = await getCatalogEntryBySlug("   ");

      expect(result).toBeNull();
      expect(sGetPublishedEntryBySlugMock).not.toHaveBeenCalled();

      jest.restoreAllMocks();
   });

   it("getCatalogEntryBySlug - service error - returns null - test", async () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      sGetPublishedEntryBySlugMock.mockRejectedValue(new Error("Not found"));

      const result = await getCatalogEntryBySlug("valid-slug");

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledTimes(1);

      jest.restoreAllMocks();
   });

   it("getCatalogEntryBySlug - entry not found - returns null - test", async () => {
      sGetPublishedEntryBySlugMock.mockResolvedValue(null);

      const result = await getCatalogEntryBySlug("no-such-entry");

      expect(result).toBeNull();
   });
});

describe("getCatalogCategories tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getCatalogCategories - success - returns categories - test", async () => {
      const categories = dtestData.dCatalogCategories();
      sGetCategoriesMock.mockResolvedValue(categories);

      const result = await getCatalogCategories();

      expect(result).toEqual(categories);
      expect(sGetCategoriesMock).toHaveBeenCalledTimes(1);
   });

   it("getCatalogCategories - service error - returns empty array - test", async () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      sGetCategoriesMock.mockRejectedValue(new Error("DB error"));

      const result = await getCatalogCategories();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledTimes(1);

      jest.restoreAllMocks();
   });
});

describe("copyCatalogEntryToUserLibrary tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("copyCatalogEntryToUserLibrary - unauthenticated - returns error - test", async () => {
      requireUserMock.mockRejectedValue(new Error("Unauthorized"));

      const result = await copyCatalogEntryToUserLibrary("entry-uuid-0001");

      expect(result).toEqual({
         success: false,
         error: "Unauthorized",
      });
      expect(sCopyEntryToUserLibraryMock).not.toHaveBeenCalled();
   });

   it("copyCatalogEntryToUserLibrary - authenticated - success - returns templateId - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const descriptor = dtestData.dPromptTemplateDescriptor();
      sCopyEntryToUserLibraryMock.mockResolvedValue(descriptor);

      const result = await copyCatalogEntryToUserLibrary("entry-uuid-0001");

      expect(result).toEqual({ success: true, templateId: descriptor.id });
      expect(sCopyEntryToUserLibraryMock).toHaveBeenCalledWith("entry-uuid-0001", user.id);
   });

   it("copyCatalogEntryToUserLibrary - service throws - returns error result - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      sCopyEntryToUserLibraryMock.mockRejectedValue(
         new Error("CatalogEntry with ID entry-uuid-0001 not found or not published")
      );

      const result = await copyCatalogEntryToUserLibrary("entry-uuid-0001");

      expect(result).toEqual({
         success: false,
         error: "CatalogEntry with ID entry-uuid-0001 not found or not published",
      });
   });
});

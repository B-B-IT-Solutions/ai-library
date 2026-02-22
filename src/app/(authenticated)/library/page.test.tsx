jest.mock("@/data/actions/library");
jest.mock("@/components/library/search-params");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";
import { Metadata } from "next";

import { librarySearchParamsCache } from "@/components/library";
import {
   getLibraryCategories,
   getLibraryCollections,
   getLibraryEntriesPage,
   getLibraryModels,
} from "@/data/actions/library";

import { LibraryPage, metadata, PageProps } from "./page";

const getLibraryCategoriesMock = getLibraryCategories as jest.MockedFunction<
   typeof getLibraryCategories
>;

const getLibraryModelsMock = getLibraryModels as jest.MockedFunction<
   typeof getLibraryModels
>;

const getLibraryCollectionsMock = getLibraryCollections as jest.MockedFunction<
   typeof getLibraryCollections
>;

const getLibraryEntriesPageMock = getLibraryEntriesPage as jest.MockedFunction<
   typeof getLibraryEntriesPage
>;

const librarySearchParamsCacheMock = librarySearchParamsCache as DeepMockProxy<
   typeof librarySearchParamsCache
>;

const expectedMetadata: Metadata = {
   title: "Meine Vorlagen",
};

const assertRendered = () => {
   const page = screen.getByTestId("library-page");
   const dashboard = screen.getByTestId("library-dashboard");

   assertInDocument(page);
   assertInDocument(dashboard);
};

describe("LibraryPage rendering tests", () => {
   beforeAll(() => {
      const categories = ["cat-1", "cat-2", "cat-3"];
      const models = ["mod-1", "mod-2", "mod-3"];
      const page = dtestData.dLibraryEntriesPage();

      getLibraryCategoriesMock.mockResolvedValue(categories);
      getLibraryModelsMock.mockResolvedValue(models);
      getLibraryCollectionsMock.mockResolvedValue([]);
      getLibraryEntriesPageMock.mockResolvedValue(page);
   });

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("LibraryPage - library page rendered - test", async () => {
      const params = { view: "grid" };

      const props: PageProps = {
         searchParams: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(LibraryPage, props);

      await waitFor(() => {
         assertRendered();
         expect(librarySearchParamsCacheMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("LibraryPage functionality tests", () => {
   it("LibraryPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});

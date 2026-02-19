jest.mock("@/data/actions/library");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import { getLibraryEntries } from "@/data/actions/library";

import { LibraryPage, metadata } from "./page";

const getLibraryEntriesMock = getLibraryEntries as jest.MockedFunction<
   typeof getLibraryEntries
>;

const expectedMetadata: Metadata = {
   title: "Meine Vorlagen",
};

const assertRendered = () => {
   const page = screen.getByTestId("library-page");
   const library = screen.getByTestId("library");

   assertInDocument(page);
   assertInDocument(library);
};

describe("LibraryPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("LibraryPage - library items empty - test", async () => {
      getLibraryEntriesMock.mockResolvedValue([]);

      const { container } = await renderAsyncRSC(LibraryPage, {});

      await waitFor(() => {
         assertRendered();
         expect(getLibraryEntriesMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryPage - library items - test", async () => {
      const libraryEntries = dtestData.dLibraryEntries();
      getLibraryEntriesMock.mockResolvedValue(libraryEntries);

      const { container } = await renderAsyncRSC(LibraryPage, {});

      await waitFor(() => {
         assertRendered();
         expect(getLibraryEntriesMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("LibraryPage functionality tests", () => {
   it("LibraryPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});

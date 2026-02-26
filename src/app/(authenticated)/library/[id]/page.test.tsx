jest.mock("@/data/actions/library");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getLibraryEntry } from "@/data/actions/library";

import { LibraryEntryPage, metadata, PageParams, PageProps } from "./page";

const getLibraryEntryMock = getLibraryEntry as jest.MockedFunction<
   typeof getLibraryEntry
>;

const notFoundMock = notFound as jest.MockedFunction<typeof notFound>;

const expectedMetadata: Metadata = {
   title: "Vorlage",
};

const assertRendered = () => {
   const page = screen.getByTestId("library-entry-view-page");
   const viewEntry = screen.getByTestId("library-entry-view");

   assertInDocument(page);
   assertInDocument(viewEntry);
};

describe("LibraryEntryPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("LibraryEntryPage - library entry null - test", async () => {
      getLibraryEntryMock.mockResolvedValue(null);

      const params: PageParams = { id: "entry-id-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(LibraryEntryPage, props);

      await waitFor(() => {
         expect(getLibraryEntryMock).toHaveBeenCalledTimes(1);
         expect(notFoundMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryEntryPage - library entry defined - test", async () => {
      const libraryEntry = dtestData.dLibraryEntryWithPromptTemplate();
      getLibraryEntryMock.mockResolvedValue(libraryEntry);

      const params: PageParams = { id: "entry-id-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(LibraryEntryPage, props);

      await waitFor(() => {
         assertRendered();
         expect(getLibraryEntryMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("LibraryEntryPage functionality tests", () => {
   it("LibraryEntryPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});

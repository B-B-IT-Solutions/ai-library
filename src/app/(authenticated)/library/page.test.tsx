jest.mock("@/components/library", () => ({
   LibraryDashboard: () => {
      return <div data-testid="library-dashboard" />;
   },
   librarySearchParamsCache: {
      parse: jest.fn(),
   },
}));

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import { librarySearchParamsCache } from "@/components/library";

import { LibraryPage, metadata, PageProps } from "./page";

const librarySearchParamsCacheParseMock =
   librarySearchParamsCache.parse as jest.MockedFunction<
      typeof librarySearchParamsCache.parse
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
         expect(librarySearchParamsCacheParseMock).toHaveBeenCalledTimes(1);
         expect(librarySearchParamsCacheParseMock).toHaveBeenCalledWith(
            props.searchParams
         );
      });

      expect(container).toMatchSnapshot();
   });
});

describe("LibraryPage functionality tests", () => {
   it("LibraryPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});

jest.mock("@/components/templates", () => ({
   TemplatesDashboard: () => {
      return <div data-testid="templates-dashboard" />;
   },
   librarySearchParamsCache: {
      parse: jest.fn(),
   },
}));

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import { librarySearchParamsCache } from "@/components/templates";

import { metadata, PageProps, TemplatesPage } from "./page";

const librarySearchParamsCacheParseMock =
   librarySearchParamsCache.parse as jest.MockedFunction<
      typeof librarySearchParamsCache.parse
   >;

const expectedMetadata: Metadata = {
   title: "Meine Vorlagen",
};

const assertRendered = () => {
   const page = screen.getByTestId("templates-page");
   const dashboard = screen.getByTestId("templates-dashboard");

   assertInDocument(page);
   assertInDocument(dashboard);
};

describe("TemplatesPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("page rendered - test", async () => {
      const params = { view: "grid" };

      const props: PageProps = {
         searchParams: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(TemplatesPage, props);

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

describe("TemplatesPage functionality tests", () => {
   it("metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});

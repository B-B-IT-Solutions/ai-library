jest.mock("@/components/collections", () => ({
   CollectionsDashboard: () => {
      return <div data-testid="collections-dashboard" />;
   },
   collectionsSearchParamsCache: {
      parse: jest.fn(),
   },
}));

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import { collectionsSearchParamsCache } from "@/components/collections";

import { CollectionsPage, metadata, PageProps } from "./page";

const collectionsSearchParamsCacheMock =
   collectionsSearchParamsCache.parse as jest.MockedFunction<
      typeof collectionsSearchParamsCache.parse
   >;

const expectedMetadata: Metadata = {
   title: "Sammlungen",
};

const assertRendered = () => {
   const page = screen.getByTestId("collections-page");
   const dashboard = screen.getByTestId("collections-dashboard");

   assertInDocument(page);
   assertInDocument(dashboard);
};

describe("CollectionsPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("page rendered - test", async () => {
      const params = { view: "grid" };

      const props: PageProps = {
         searchParams: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(CollectionsPage, props);

      await waitFor(() => {
         assertRendered();
         expect(collectionsSearchParamsCacheMock).toHaveBeenCalledTimes(1);
         expect(collectionsSearchParamsCacheMock).toHaveBeenCalledWith(
            props.searchParams
         );
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CollectionsPage functionality tests", () => {
   it("metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});

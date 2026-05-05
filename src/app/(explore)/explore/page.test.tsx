jest.mock("@/components/explore", () => ({
   CatalogEntriesDashboard: () => {
      return <div data-testid="catalog-entries-dashboard" />;
   },
   exploreSearchParamsCache: {
      parse: jest.fn(),
   },
}));

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import { exploreSearchParamsCache } from "@/components/explore";

import { ExplorePage, metadata, PageProps } from "./page";

const exploreSearchParamsCacheMock =
   exploreSearchParamsCache.parse as jest.MockedFunction<
      typeof exploreSearchParamsCache.parse
   >;

const expectedMetadata: Metadata = {
   title: "KI Prompt-Vorlagen entdecken",
   description:
      "Entdecke kuratierte AI-Prompt-Vorlagen mit strukturierten Feldern. Kostenlos durchsuchen, filtern und in deine Library übernehmen.",
};

const assertRendered = () => {
   const page = screen.getByTestId("explore-page");
   const dashboard = screen.getByTestId("catalog-entries-dashboard");

   assertInDocument(page);
   assertInDocument(dashboard);
};

describe("ExplorePage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("page rendered - test", async () => {
      const params = { view: "grid" };

      const props: PageProps = {
         searchParams: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(ExplorePage, props);

      await waitFor(() => {
         assertRendered();
         expect(exploreSearchParamsCacheMock).toHaveBeenCalledTimes(1);
         expect(exploreSearchParamsCacheMock).toHaveBeenCalledWith(
            props.searchParams
         );
      });

      expect(container).toMatchSnapshot();
   });
});

describe("ExplorePage functionality tests", () => {
   it("metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});

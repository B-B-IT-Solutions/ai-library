jest.mock("@/data/actions/catalog");
jest.mock("@/data/actions/auth-utils");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { isAuthenticated } from "@/data/actions/auth-utils";
import {
   getPublishedCatalogEntriesPage,
   getPublishedCatalogEntryBySlug,
} from "@/data/actions/catalog";
import { DCatalogEntriesPageQuery } from "@/data/types/domain/catalog";

import {
   CatalogEntryPage,
   generateMetadata,
   PageParams,
   PageProps,
} from "./page";

const isAuthenticatedMock = isAuthenticated as jest.MockedFunction<
   typeof isAuthenticated
>;

const getPublishedCatalogEntryBySlugMock =
   getPublishedCatalogEntryBySlug as jest.MockedFunction<
      typeof getPublishedCatalogEntryBySlug
   >;

const getPublishedCatalogEntriesPageMock =
   getPublishedCatalogEntriesPage as jest.MockedFunction<
      typeof getPublishedCatalogEntriesPage
   >;

const notFoundMock = notFound as jest.MockedFunction<typeof notFound>;

const assertRendered = () => {
   const page = screen.getByTestId("catalog-entry-page");
   const view = screen.getByTestId("catalog-entry-view");

   assertInDocument(page);
   assertInDocument(view);
};

describe("CatalogEntryPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("entry null - test", async () => {
      getPublishedCatalogEntryBySlugMock.mockResolvedValue(null);
      isAuthenticatedMock.mockResolvedValue(false);

      const params: PageParams = { slug: "entry-slug-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(CatalogEntryPage, props);

      await waitFor(() => {
         expect(isAuthenticated).toHaveBeenCalledTimes(1);
         expect(getPublishedCatalogEntryBySlugMock).toHaveBeenCalledTimes(1);
         expect(getPublishedCatalogEntryBySlugMock).toHaveBeenCalledWith(
            params.slug
         );
         expect(notFoundMock).toHaveBeenCalledTimes(1);
         expect(getPublishedCatalogEntriesPageMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });

   it("entry retrieved - category null - test", async () => {
      const entry = dtestData.dCatalogEntry();
      entry.category = null;

      getPublishedCatalogEntryBySlugMock.mockResolvedValue(entry);
      isAuthenticatedMock.mockResolvedValue(true);

      const params: PageParams = { slug: "entry-slug-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(CatalogEntryPage, props);

      await waitFor(() => {
         assertRendered();
      });

      await waitFor(() => {
         expect(isAuthenticated).toHaveBeenCalledTimes(1);
         expect(getPublishedCatalogEntryBySlugMock).toHaveBeenCalledTimes(1);
         expect(getPublishedCatalogEntryBySlugMock).toHaveBeenCalledWith(
            params.slug
         );
         expect(getPublishedCatalogEntriesPageMock).not.toHaveBeenCalled();
         expect(notFoundMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });

   it("entry retrieved - test", async () => {
      const entry = dtestData.dCatalogEntry();
      getPublishedCatalogEntryBySlugMock.mockResolvedValue(entry);
      isAuthenticatedMock.mockResolvedValue(true);

      const page = dtestData.dCatalogEntriesPage();
      getPublishedCatalogEntriesPageMock.mockResolvedValue(page);

      const params: PageParams = { slug: "entry-slug-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(CatalogEntryPage, props);

      await waitFor(() => {
         assertRendered();
      });

      const expectePageQuery: DCatalogEntriesPageQuery = {
         pagination: { pageNumber: 0, pageSize: 4 },
         filter: { categories: [entry.category!.slug] },
      };

      await waitFor(() => {
         expect(isAuthenticated).toHaveBeenCalledTimes(1);
         expect(getPublishedCatalogEntryBySlugMock).toHaveBeenCalledTimes(1);
         expect(getPublishedCatalogEntryBySlugMock).toHaveBeenCalledWith(
            params.slug
         );
         expect(getPublishedCatalogEntriesPageMock).toHaveBeenCalledTimes(1);
         expect(getPublishedCatalogEntriesPageMock).toHaveBeenCalledWith(
            expectePageQuery
         );
         expect(notFoundMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CatalogEntryPage functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("generateMetadata- entry null - test", async () => {
      getPublishedCatalogEntryBySlugMock.mockResolvedValue(null);

      const pageParams: PageParams = {
         slug: "entry-slug-1",
      };
      const props: PageProps = {
         params: Promise.resolve(pageParams),
      };

      const metadata = await generateMetadata(props);
      const expectedMetadata: Metadata = {
         title: "Vorlage nicht gefunden",
      };

      expect(metadata).toEqual(expectedMetadata);
      expect(getPublishedCatalogEntryBySlugMock).toHaveBeenCalledTimes(1);
      expect(getPublishedCatalogEntryBySlugMock).toHaveBeenCalledWith(
         pageParams.slug
      );
   });

   it("generateMetadata- entry defined - test", async () => {
      const entry = dtestData.dCatalogEntry();
      getPublishedCatalogEntryBySlugMock.mockResolvedValue(entry);

      const pageParams: PageParams = {
         slug: "entry-slug-1",
      };
      const props: PageProps = {
         params: Promise.resolve(pageParams),
      };

      const metadata = await generateMetadata(props);
      const expectedMetadata: Metadata = {
         title: entry.title,
         description: entry.description,
         openGraph: {
            title: entry.title,
            description: entry.description,
         },
      };

      expect(metadata).toEqual(expectedMetadata);
      expect(getPublishedCatalogEntryBySlugMock).toHaveBeenCalledTimes(1);
      expect(getPublishedCatalogEntryBySlugMock).toHaveBeenCalledWith(
         pageParams.slug
      );
   });
});

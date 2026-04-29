jest.mock("@/data/actions/collection");
jest.mock("@/components/collections", () => ({
   CollectionViewPublic: () => {
      return <div data-testid="collection-view-public" />;
   },
}));

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPublicCollectionByToken } from "@/data/actions/collection";

import {
   generateMetadata,
   PageParams,
   PageProps,
   PublicCollectionPage,
} from "./page";

const getPublicCollectionByTokenMock =
   getPublicCollectionByToken as jest.MockedFunction<
      typeof getPublicCollectionByToken
   >;

const notFoundMock = notFound as jest.MockedFunction<typeof notFound>;

const assertRendered = () => {
   const page = screen.getByTestId("public-collection-page");
   const view = screen.getByTestId("collection-view-public");

   assertInDocument(page);
   assertInDocument(view);
};

describe("PublicCollectionPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("collection null - test", async () => {
      getPublicCollectionByTokenMock.mockResolvedValue(null);

      const pageParams: PageParams = { token: "collection-token-1" };

      const props: PageProps = {
         params: Promise.resolve(pageParams),
      };

      const { container } = await renderAsyncRSC(PublicCollectionPage, props);

      await waitFor(() => {
         expect(getPublicCollectionByTokenMock).toHaveBeenCalledTimes(1);
         expect(getPublicCollectionByTokenMock).toHaveBeenCalledWith(
            pageParams.token
         );

         expect(notFoundMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("collection defined - test", async () => {
      const collection = dtestData.dCollection();
      getPublicCollectionByTokenMock.mockResolvedValue(collection);

      const pageParams: PageParams = { token: "collection-token-1" };

      const props: PageProps = {
         params: Promise.resolve(pageParams),
      };

      const { container } = await renderAsyncRSC(PublicCollectionPage, props);

      await waitFor(() => {
         assertRendered();
         expect(getPublicCollectionByTokenMock).toHaveBeenCalledTimes(1);
         expect(getPublicCollectionByTokenMock).toHaveBeenCalledWith(
            pageParams.token
         );
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PublicCollectionPage functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("generateMetadata- collection null - test", async () => {
      getPublicCollectionByTokenMock.mockResolvedValue(null);

      const pageParams: PageParams = {
         token: "collection-token-1",
      };
      const props: PageProps = {
         params: Promise.resolve(pageParams),
      };

      const metadata = await generateMetadata(props);
      const expectedMetadata: Metadata = {
         title: "Sammlung nicht gefunden",
      };

      expect(metadata).toEqual(expectedMetadata);
      expect(getPublicCollectionByTokenMock).toHaveBeenCalledTimes(1);
      expect(getPublicCollectionByTokenMock).toHaveBeenCalledWith(
         pageParams.token
      );
   });

   it("generateMetadata- collection defined - test", async () => {
      const collection = dtestData.dCollection();
      getPublicCollectionByTokenMock.mockResolvedValue(collection);

      const pageParams: PageParams = {
         token: "collection-token-1",
      };
      const props: PageProps = {
         params: Promise.resolve(pageParams),
      };

      const metadata = await generateMetadata(props);
      const expectedMetadata: Metadata = {
         title: `${collection.name} - Sammlung`,
         description: collection.description,
      };

      expect(metadata).toEqual(expectedMetadata);
      expect(getPublicCollectionByTokenMock).toHaveBeenCalledTimes(1);
      expect(getPublicCollectionByTokenMock).toHaveBeenCalledWith(
         pageParams.token
      );
   });
});

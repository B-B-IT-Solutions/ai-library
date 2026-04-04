jest.mock("@/data/actions/collection");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCollectionById } from "@/data/actions/collection";

import { CollectionEditPage, metadata, PageParams, PageProps } from "./page";

const getCollectionByIdMock = getCollectionById as jest.MockedFunction<
   typeof getCollectionById
>;

const notFoundMock = notFound as jest.MockedFunction<typeof notFound>;

const expectedMetadata: Metadata = {
   title: "Sammlung Bearbeiten",
};

const assertRendered = () => {
   const page = screen.getByTestId("collection-edit-page");
   const collectionEdit = screen.getByTestId("collection-edit");

   assertInDocument(page);
   assertInDocument(collectionEdit);
};

describe("CollectionEditPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("collection null - test", async () => {
      getCollectionByIdMock.mockResolvedValue(null);

      const params: PageParams = { id: "collection-id-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(CollectionEditPage, props);

      await waitFor(() => {
         expect(getCollectionByIdMock).toHaveBeenCalledTimes(1);
         expect(notFoundMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("collection defined - test", async () => {
      const collection = dtestData.dCollection();
      getCollectionByIdMock.mockResolvedValue(collection);

      const params: PageParams = { id: "collection-id-1" };
      const props: PageProps = {
         params: Promise.resolve(params),
      };

      const { container } = await renderAsyncRSC(CollectionEditPage, props);

      await waitFor(() => {
         assertRendered();
         expect(getCollectionByIdMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CollectionEditPage functionality tests", () => {
   it("metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});

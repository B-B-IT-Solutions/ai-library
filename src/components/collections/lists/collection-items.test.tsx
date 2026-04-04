jest.mock("@/data/actions/collection");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { getCollections } from "@/data/actions/collection";
import { DListViewMode } from "@/data/types/domain/common";

import { CollectionItems } from "./collection-items";

const getCollectionsMock = getCollections as jest.MockedFunction<
   typeof getCollections
>;

const assertItemsEmptyRendered = () => {
   const empty = screen.getByTestId("collection-items-empty");
   assertInDocument(empty);
};

const assertGridRendered = () => {
   const items = screen.getByTestId("collection-items-grid");
   assertInDocument(items);
};

const assertListRendered = () => {
   const items = screen.getByTestId("collection-items-list");
   assertInDocument(items);
};

describe("CollectionItems rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("collection empty - test", async () => {
      getCollectionsMock.mockResolvedValue([]);

      const { container } = renderWithRouter(
         <CollectionItems viewMode={DListViewMode.GRID} />
      );

      await waitFor(() => {
         assertItemsEmptyRendered();
         expect(getCollectionsMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("view grid - test", async () => {
      const collections = dtestData.dCollections();
      getCollectionsMock.mockResolvedValue(collections);

      const { container } = renderWithRouter(
         <CollectionItems viewMode={DListViewMode.GRID} />
      );

      await waitFor(() => {
         assertGridRendered();
         expect(getCollectionsMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("view list - test", async () => {
      const collections = dtestData.dCollections();
      getCollectionsMock.mockResolvedValue(collections);

      const { container } = renderWithRouter(
         <CollectionItems viewMode={DListViewMode.LIST} />
      );

      await waitFor(() => {
         assertListRendered();
         expect(getCollectionsMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });
});

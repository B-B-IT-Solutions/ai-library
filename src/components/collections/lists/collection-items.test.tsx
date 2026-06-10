jest.mock("@/data/actions/collection");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { getCollectionsPage } from "@/data/actions/collection";
import { DCollectionsPageQuery } from "@/data/types/domain/collection";
import {
   DCollectionsSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";

import { CollectionItems } from "./collection-items";

const getCollectionsPageMock = getCollectionsPage as jest.MockedFunction<
   typeof getCollectionsPage
>;

const assertItemsEmptyRendered = () => {
   const empty = screen.getByTestId("collection-items-empty");
   const createBtn = screen.getByTestId("create-collection-btn");

   assertInDocument(empty);
   assertInDocument(createBtn);
};

const assertGridRendered = () => {
   const items = screen.getByTestId("collection-items-grid");
   assertInDocument(items);
};

const assertListRendered = () => {
   const items = screen.getByTestId("collection-items-list");
   assertInDocument(items);
};

const assertGetCollectionsPageCalled = (
   expectedPayload: DCollectionsPageQuery
) => {
   expect(getCollectionsPageMock).toHaveBeenCalledTimes(1);
   expect(getCollectionsPageMock).toHaveBeenCalledWith(expectedPayload);
};

describe("CollectionItems rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("collection empty - test", async () => {
      const page = dtestData.dCollectionsPage(0);
      getCollectionsPageMock.mockResolvedValue(page);

      const { container } = renderWithRouter(
         <CollectionItems
            viewMode={DListViewMode.GRID}
            sortMode={DCollectionsSortByMode.NAME_ASC}
            filters={{}}
         />
      );

      await waitFor(() => {
         assertItemsEmptyRendered();
         expect(getCollectionsPageMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("view grid - test", async () => {
      const page = dtestData.dCollectionsPage();
      getCollectionsPageMock.mockResolvedValue(page);
      const filters = dtestData.dCollectionsFilter();

      const { container } = renderWithRouter(
         <CollectionItems
            viewMode={DListViewMode.GRID}
            sortMode={DCollectionsSortByMode.NAME_DESC}
            filters={filters}
         />
      );

      const expectedPayload: DCollectionsPageQuery = {
         pagination: {
            pageNumber: 0,
            pageSize: 10,
         },
         filter: filters,
         sort: { field: "name", order: "desc" },
      };

      await waitFor(() => {
         assertGridRendered();
         assertGetCollectionsPageCalled(expectedPayload);
      });

      expect(container).toMatchSnapshot();
   });

   it("view list - test", async () => {
      const page = dtestData.dCollectionsPage();
      getCollectionsPageMock.mockResolvedValue(page);
      const filters = dtestData.dCollectionsFilter();

      const { container } = renderWithRouter(
         <CollectionItems
            viewMode={DListViewMode.LIST}
            sortMode={DCollectionsSortByMode.NAME_ASC}
            filters={filters}
         />
      );

      const expectedPayload: DCollectionsPageQuery = {
         pagination: {
            pageNumber: 0,
            pageSize: 10,
         },
         filter: filters,
         sort: { field: "name", order: "asc" },
      };

      await waitFor(() => {
         assertListRendered();
         assertGetCollectionsPageCalled(expectedPayload);
      });

      expect(container).toMatchSnapshot();
   });
});

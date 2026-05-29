jest.mock("@/data/actions/collection");
jest.mock("@/data/actions/prompt");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { getCollections } from "@/data/actions/collection";
import { getPromptsPage } from "@/data/actions/prompt";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { DPromptsPageQuery } from "@/data/types/domain/prompt";

import { TemplateItems } from "./template-items";

const getCollectionsMock = getCollections as jest.MockedFunction<
   typeof getCollections
>;

const getPromptsPageMock = getPromptsPage as jest.MockedFunction<
   typeof getPromptsPage
>;

const assertGridRendered = () => {
   const entries = screen.getByTestId("template-items-grid");
   assertInDocument(entries);
};

const assertListRendered = () => {
   const entries = screen.getByTestId("template-items-list");
   assertInDocument(entries);
};

const assertGetLibraryEntriesPageCalled = (
   expectedPayload: DPromptsPageQuery
) => {
   expect(getPromptsPageMock).toHaveBeenCalledTimes(1);
   expect(getPromptsPageMock).toHaveBeenCalledWith(expectedPayload);
};

describe("TemplateItems rendering tests", () => {
   beforeAll(() => {
      const page = dtestData.dPromptsPage();

      getCollectionsMock.mockResolvedValue([]);
      getPromptsPageMock.mockResolvedValue(page);
   });

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("view grid - test", async () => {
      const filters = dtestData.dPromptsFilter();
      const collection = dtestData.dCollection();

      const { container } = renderWithRouter(
         <TemplateItems
            viewMode={DListViewMode.GRID}
            groupBy={DListGroupByMode.NONE}
            sortBy={DListSortByMode.DATE_DESC}
            filters={filters}
            collectionId={collection.id}
         />
      );

      const expectedPayload: DPromptsPageQuery = {
         pagination: {
            pageNumber: 0,
            pageSize: 10,
         },
         filter: filters,
         sort: { field: "createdAt", order: "desc" },
      };

      await waitFor(() => {
         assertGridRendered();
         assertGetLibraryEntriesPageCalled(expectedPayload);
      });

      expect(container).toMatchSnapshot();
   });

   it("view list - test", async () => {
      const filters = dtestData.dPromptsFilter();

      const { container } = renderWithRouter(
         <TemplateItems
            viewMode={DListViewMode.LIST}
            groupBy={DListGroupByMode.NONE}
            sortBy={DListSortByMode.DATE_ASC}
            filters={filters}
         />
      );

      const expectedPayload: DPromptsPageQuery = {
         pagination: {
            pageNumber: 0,
            pageSize: 10,
         },
         filter: filters,
         sort: { field: "createdAt", order: "asc" },
      };

      await waitFor(() => {
         assertListRendered();
         assertGetLibraryEntriesPageCalled(expectedPayload);
      });

      expect(container).toMatchSnapshot();
   });
});

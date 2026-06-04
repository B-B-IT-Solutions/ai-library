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

const assertPromptsEmptyRendered = () => {
   const empty = screen.getByTestId("prompt-items-empty");
   assertInDocument(empty);
};

const assertPromptsFilterEmptyRendered = () => {
   const empty = screen.getByTestId("prompt-items-filter-empty");
   assertInDocument(empty);
};

const assertGetLibraryEntriesPageCalled = (
   expectedPayload: DPromptsPageQuery
) => {
   expect(getPromptsPageMock).toHaveBeenCalledTimes(1);
   expect(getPromptsPageMock).toHaveBeenCalledWith(expectedPayload);
};

describe("TemplateItems rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("prompts - empty - test", async () => {
      const page = dtestData.dPromptsPage();
      page.content = [];
      getPromptsPageMock.mockResolvedValue(page);
      getCollectionsMock.mockResolvedValue([]);

      const { container } = renderWithRouter(
         <TemplateItems
            viewMode={DListViewMode.GRID}
            groupBy={DListGroupByMode.NONE}
            sortBy={DListSortByMode.DATE_DESC}
            filters={{}}
         />
      );

      await waitFor(() => {
         assertPromptsEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("prompts - filter empty - test", async () => {
      const page = dtestData.dPromptsPage();
      page.content = [];
      getPromptsPageMock.mockResolvedValue(page);
      getCollectionsMock.mockResolvedValue([]);

      const filters = dtestData.dPromptsFilter();

      const { container } = renderWithRouter(
         <TemplateItems
            viewMode={DListViewMode.GRID}
            groupBy={DListGroupByMode.NONE}
            sortBy={DListSortByMode.DATE_DESC}
            filters={filters}
         />
      );

      await waitFor(() => {
         assertPromptsFilterEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("view grid - test", async () => {
      const page = dtestData.dPromptsPage();
      getPromptsPageMock.mockResolvedValue(page);
      getCollectionsMock.mockResolvedValue([]);

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
      const page = dtestData.dPromptsPage();
      getPromptsPageMock.mockResolvedValue(page);
      getCollectionsMock.mockResolvedValue([]);

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

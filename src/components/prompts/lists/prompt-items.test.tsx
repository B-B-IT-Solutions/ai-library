jest.mock("@/data/actions/collection");
jest.mock("@/data/actions/prompt");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { getCollectionPreviews } from "@/data/actions/collection";
import { getPromptsPage } from "@/data/actions/prompt";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { DPromptsPageQuery } from "@/data/types/domain/prompt";

import { PromptItems } from "./prompt-items";

const getCollectionPreviewsMock = getCollectionPreviews as jest.MockedFunction<
   typeof getCollectionPreviews
>;

const getPromptsPageMock = getPromptsPage as jest.MockedFunction<
   typeof getPromptsPage
>;

const assertGridRendered = () => {
   const entries = screen.getByTestId("prompt-items-grid");
   assertInDocument(entries);
};

const assertListRendered = () => {
   const entries = screen.getByTestId("prompt-items-list");
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

describe("PromptItems rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("prompts - empty - test", async () => {
      const page = dtestData.dPromptsPage(0);
      getPromptsPageMock.mockResolvedValue(page);
      getCollectionPreviewsMock.mockResolvedValue([]);

      const { container } = renderWithRouter(
         <PromptItems
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
      const page = dtestData.dPromptsPage(0);
      getPromptsPageMock.mockResolvedValue(page);
      getCollectionPreviewsMock.mockResolvedValue([]);

      const filters = dtestData.dPromptsFilter();

      const { container } = renderWithRouter(
         <PromptItems
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
      getCollectionPreviewsMock.mockResolvedValue([]);

      const filters = dtestData.dPromptsFilter();
      const collection = dtestData.dCollectionPreview();

      const { container } = renderWithRouter(
         <PromptItems
            viewMode={DListViewMode.GRID}
            groupBy={DListGroupByMode.NONE}
            sortBy={DListSortByMode.DATE_DESC}
            filters={filters}
            currentCollection={collection}
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
      getCollectionPreviewsMock.mockResolvedValue([]);

      const filters = dtestData.dPromptsFilter();

      const { container } = renderWithRouter(
         <PromptItems
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

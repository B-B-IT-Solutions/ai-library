jest.mock("@/data/actions/prompt");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { getPublicPromptsPage } from "@/data/actions/prompt";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { DPromptsPageQuery } from "@/data/types/domain/prompt";

import { PublicPromptItems } from "./prompt-items-public";

const getPublicPromptsPageMock = getPublicPromptsPage as jest.MockedFunction<
   typeof getPublicPromptsPage
>;

const assertGridRendered = () => {
   const prompts = screen.getByTestId("prompts-grid-public");
   assertInDocument(prompts);
};

const assertPromptsEmptyRendered = () => {
   const empty = screen.getByTestId("prompts-empty");
   assertInDocument(empty);
};

const assertPromptsFilterEmptyRendered = () => {
   const empty = screen.getByTestId("prompts-filter-empty");
   assertInDocument(empty);
};

const assertGetLibraryEntriesPageCalled = (
   expectedPayload: DPromptsPageQuery
) => {
   expect(getPublicPromptsPageMock).toHaveBeenCalledTimes(1);
   expect(getPublicPromptsPageMock).toHaveBeenCalledWith(expectedPayload);
};

describe("PublicPromptItems rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("prompts - empty - test", async () => {
      const page = dtestData.dPromptsPage(0);
      getPublicPromptsPageMock.mockResolvedValue(page);

      const { container } = renderWithRouter(
         <PublicPromptItems
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
      getPublicPromptsPageMock.mockResolvedValue(page);

      const filters = dtestData.dPromptsFilter();

      const { container } = renderWithRouter(
         <PublicPromptItems
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
      getPublicPromptsPageMock.mockResolvedValue(page);

      const filters = dtestData.dPromptsFilter();

      const { container } = renderWithRouter(
         <PublicPromptItems
            viewMode={DListViewMode.GRID}
            groupBy={DListGroupByMode.NONE}
            sortBy={DListSortByMode.DATE_DESC}
            filters={filters}
            collectionToken="public-token-1"
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
});

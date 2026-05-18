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

import { PublicTemplateItems } from "./template-items-public";

const getPublicPromptsPageMock = getPublicPromptsPage as jest.MockedFunction<
   typeof getPublicPromptsPage
>;

const assertGridRendered = () => {
   const items = screen.getByTestId("public-template-items-grid");
   assertInDocument(items);
};

const assertGetLibraryEntriesPageCalled = (
   expectedPayload: DPromptsPageQuery
) => {
   expect(getPublicPromptsPageMock).toHaveBeenCalledTimes(1);
   expect(getPublicPromptsPageMock).toHaveBeenCalledWith(expectedPayload);
};

describe("TemplateItemsPublic rendering tests", () => {
   beforeAll(() => {
      const page = dtestData.dPromptsPage();
      getPublicPromptsPageMock.mockResolvedValue(page);
   });

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("view grid - test", async () => {
      const filters = dtestData.dPromptsFilter();

      const { container } = renderWithRouter(
         <PublicTemplateItems
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

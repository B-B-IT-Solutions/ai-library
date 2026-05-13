jest.mock("@/data/actions/template");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { getPublicTemplateDescriptorsPage } from "@/data/actions/template";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { DPromptsPageQuery } from "@/data/types/domain/prompt";

import { PublicTemplateItems } from "./template-items-public";

const getPublicTemplateDescriptorsPageMock =
   getPublicTemplateDescriptorsPage as jest.MockedFunction<
      typeof getPublicTemplateDescriptorsPage
   >;

const assertGridRendered = () => {
   const items = screen.getByTestId("public-template-items-grid");
   assertInDocument(items);
};

const assertGetLibraryEntriesPageCalled = (
   expectedPayload: DPromptsPageQuery
) => {
   expect(getPublicTemplateDescriptorsPageMock).toHaveBeenCalledTimes(1);
   expect(getPublicTemplateDescriptorsPageMock).toHaveBeenCalledWith(
      expectedPayload
   );
};

describe("TemplateItemsPublic rendering tests", () => {
   beforeAll(() => {
      const page = dtestData.dPromptsPage();
      getPublicTemplateDescriptorsPageMock.mockResolvedValue(page);
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

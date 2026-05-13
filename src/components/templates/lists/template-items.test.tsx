jest.mock("@/data/actions/collection");
jest.mock("@/data/actions/prompt");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { getCollections } from "@/data/actions/collection";
import { getTemplateDescriptorsPage } from "@/data/actions/prompt";
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

const getTemplateDescriptorsPageMock =
   getTemplateDescriptorsPage as jest.MockedFunction<
      typeof getTemplateDescriptorsPage
   >;

const assertGridRendered = () => {
   const entries = screen.getByTestId("template-items-grid");
   assertInDocument(entries);
};

const assertListRendered = () => {
   const entries = screen.getByTestId("template-items-list");
   assertInDocument(entries);
};

const assertGroupsendered = () => {
   const entries = screen.getByTestId("library-entries-groups");
   assertInDocument(entries);
};

const assertGetLibraryEntriesPageCalled = (
   expectedPayload: DPromptsPageQuery
) => {
   expect(getTemplateDescriptorsPageMock).toHaveBeenCalledTimes(1);
   expect(getTemplateDescriptorsPageMock).toHaveBeenCalledWith(expectedPayload);
};

describe("LibraryDashboard rendering tests", () => {
   beforeAll(() => {
      const page = dtestData.dPromptsPage();

      getCollectionsMock.mockResolvedValue([]);
      getTemplateDescriptorsPageMock.mockResolvedValue(page);
   });

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("LibraryEntries - view grid - test", async () => {
      const filters = dtestData.dPromptsFilter();

      const { container } = renderWithRouter(
         <TemplateItems
            viewMode={DListViewMode.GRID}
            groupBy={DListGroupByMode.NONE}
            sortBy={DListSortByMode.DATE_DESC}
            filters={filters}
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

   it("LibraryEntries - view list - test", async () => {
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

   it("LibraryEntries - groups - test", async () => {
      const { container } = renderWithRouter(
         <TemplateItems
            viewMode={DListViewMode.LIST}
            groupBy={DListGroupByMode.MODEL}
            sortBy={DListSortByMode.TITLE_ASC}
            filters={{}}
         />
      );

      const expectedPayload: DPromptsPageQuery = {
         pagination: {
            pageNumber: 0,
            pageSize: 10,
         },
         filter: {},
         sort: { field: "title", order: "asc" },
      };

      await waitFor(() => {
         assertGroupsendered();
         assertGetLibraryEntriesPageCalled(expectedPayload);
      });

      expect(container).toMatchSnapshot();
   });
});

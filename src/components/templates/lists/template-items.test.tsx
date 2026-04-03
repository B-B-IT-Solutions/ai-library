jest.mock("@/data/actions/collections");
jest.mock("@/data/actions/prompt-template");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { getLibraryCollections } from "@/data/actions/collections";
import { getTemplateDescriptorsPage } from "@/data/actions/prompt-template";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { DTemplateDescriptorsPageQuery } from "@/data/types/domain/prompt.template";

import { TemplateItems } from "./template-items";

const getLibraryCollectionsMock = getLibraryCollections as jest.MockedFunction<
   typeof getLibraryCollections
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
   expectedPayload: DTemplateDescriptorsPageQuery
) => {
   expect(getTemplateDescriptorsPageMock).toHaveBeenCalledTimes(1);
   expect(getTemplateDescriptorsPageMock).toHaveBeenCalledWith(expectedPayload);
};

describe("LibraryDashboard rendering tests", () => {
   beforeAll(() => {
      const page = dtestData.dTemplateDescriptorsPage();

      getLibraryCollectionsMock.mockResolvedValue([]);
      getTemplateDescriptorsPageMock.mockResolvedValue(page);
   });

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("LibraryEntries - view grid - test", async () => {
      const filters = dtestData.dTemplateDescriptorsFilter();

      const { container } = renderWithRouter(
         <TemplateItems
            viewMode={DListViewMode.GRID}
            groupBy={DListGroupByMode.NONE}
            sortBy={DListSortByMode.DATE_DESC}
            filters={filters}
         />
      );

      const expectedPayload: DTemplateDescriptorsPageQuery = {
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
      const filters = dtestData.dTemplateDescriptorsFilter();

      const { container } = renderWithRouter(
         <TemplateItems
            viewMode={DListViewMode.LIST}
            groupBy={DListGroupByMode.NONE}
            sortBy={DListSortByMode.DATE_ASC}
            filters={filters}
         />
      );

      const expectedPayload: DTemplateDescriptorsPageQuery = {
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

      const expectedPayload: DTemplateDescriptorsPageQuery = {
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

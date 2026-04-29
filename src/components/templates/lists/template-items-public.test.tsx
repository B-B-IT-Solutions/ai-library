jest.mock("@/data/actions/prompt-template");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { getPublicTemplateDescriptorsPage } from "@/data/actions/prompt-template";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { DTemplateDescriptorsPageQuery } from "@/data/types/domain/prompt.template";

import { TemplateItemsPublic } from "./template-items-public";

const getPublicTemplateDescriptorsPageMock =
   getPublicTemplateDescriptorsPage as jest.MockedFunction<
      typeof getPublicTemplateDescriptorsPage
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
   expectedPayload: DTemplateDescriptorsPageQuery
) => {
   expect(getPublicTemplateDescriptorsPageMock).toHaveBeenCalledTimes(1);
   expect(getPublicTemplateDescriptorsPageMock).toHaveBeenCalledWith(
      expectedPayload
   );
};

describe("TemplateItemsPublic rendering tests", () => {
   beforeAll(() => {
      const page = dtestData.dTemplateDescriptorsPage();
      getPublicTemplateDescriptorsPageMock.mockResolvedValue(page);
   });

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("view grid - test", async () => {
      const filters = dtestData.dTemplateDescriptorsFilter();

      const { container } = renderWithRouter(
         <TemplateItemsPublic
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

   it("view list - test", async () => {
      const filters = dtestData.dTemplateDescriptorsFilter();

      const { container } = renderWithRouter(
         <TemplateItemsPublic
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
});

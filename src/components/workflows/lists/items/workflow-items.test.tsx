jest.mock("@/data/actions/workflow");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { getWorkflowsPage } from "@/data/actions/workflow";
import {
   DListViewMode,
   DWorkflowsSortByMode,
} from "@/data/types/domain/common";
import { DPromptsPageQuery } from "@/data/types/domain/prompt";
import { DWorkflowsPageQuery } from "@/data/types/domain/workflow";

import { WorkflowItems } from "./workflow-items";

const getWorkflowsPageMock = getWorkflowsPage as jest.MockedFunction<
   typeof getWorkflowsPage
>;

const assertGridRendered = () => {
   const entries = screen.getByTestId("workflows-grid");
   assertInDocument(entries);
};

const assertListRendered = () => {
   const entries = screen.getByTestId("workflows-list");
   assertInDocument(entries);
};

const assertWorfklowsEmptyRendered = () => {
   const empty = screen.getByTestId("workflows-empty");
   assertInDocument(empty);
};

const assertWorkflowsFilterEmptyRendered = () => {
   const empty = screen.getByTestId("workflows-filter-empty");
   assertInDocument(empty);
};

const assertGetWorkflowsPageCalled = (expectedPayload: DWorkflowsPageQuery) => {
   expect(getWorkflowsPageMock).toHaveBeenCalledTimes(1);
   expect(getWorkflowsPageMock).toHaveBeenCalledWith(expectedPayload);
};

describe("WorkflowItems rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("prompts - empty - test", async () => {
      const page = dtestData.dWorkflowsPage(0);
      getWorkflowsPageMock.mockResolvedValue(page);

      const { container } = renderWithRouter(
         <WorkflowItems
            viewMode={DListViewMode.GRID}
            sortMode={DWorkflowsSortByMode.DATE_DESC}
            filters={{}}
         />
      );

      await waitFor(() => {
         assertWorfklowsEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("prompts - filter empty - test", async () => {
      const page = dtestData.dWorkflowsPage(0);
      getWorkflowsPageMock.mockResolvedValue(page);

      const filters = dtestData.dWorkflowsFilter();

      const { container } = renderWithRouter(
         <WorkflowItems
            viewMode={DListViewMode.GRID}
            sortMode={DWorkflowsSortByMode.DATE_DESC}
            filters={filters}
         />
      );

      await waitFor(() => {
         assertWorkflowsFilterEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("view grid - test", async () => {
      const page = dtestData.dWorkflowsPage();
      getWorkflowsPageMock.mockResolvedValue(page);

      const filters = dtestData.dWorkflowsFilter();

      const { container } = renderWithRouter(
         <WorkflowItems
            viewMode={DListViewMode.GRID}
            sortMode={DWorkflowsSortByMode.DATE_DESC}
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
         assertGetWorkflowsPageCalled(expectedPayload);
      });

      expect(container).toMatchSnapshot();
   });

   it("view list - test", async () => {
      const page = dtestData.dWorkflowsPage();
      getWorkflowsPageMock.mockResolvedValue(page);

      const filters = dtestData.dWorkflowsFilter();

      const { container } = renderWithRouter(
         <WorkflowItems
            viewMode={DListViewMode.LIST}
            sortMode={DWorkflowsSortByMode.DATE_ASC}
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
         assertGetWorkflowsPageCalled(expectedPayload);
      });

      expect(container).toMatchSnapshot();
   });
});

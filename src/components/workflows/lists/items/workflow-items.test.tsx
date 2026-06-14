jest.mock("@/data/actions/workflow");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { getWorkflowsPage } from "@/data/actions/workflow";
import { DListViewMode } from "@/data/types/domain/common";
import { DWorkflowsPageQuery } from "@/data/types/domain/workflow";

import { WorkflowItems } from "./workflow-items";

const getWorkflowsPageMock = getWorkflowsPage as jest.MockedFunction<
   typeof getWorkflowsPage
>;

const assertSkeletonRendered = () => {
   const skeleton = screen.getByTestId("workflows-skeleton");
   assertInDocument(skeleton);
};

const assertEmptyStateRendered = () =>
   assertInDocument(screen.getByTestId("workflows-empty-state"));

const assertWorkflowCardsRendered = (count: number) => {
   const workflows = dtestData.dWorkflows(count);
   workflows.forEach((w) =>
      assertInDocument(screen.getByTestId(`workflow-card-${w.id}`))
   );
};

const assertGetWorkflowsPageCalled = (expected: DWorkflowsPageQuery) => {
   expect(getWorkflowsPageMock).toHaveBeenCalledTimes(1);
   expect(getWorkflowsPageMock).toHaveBeenCalledWith(expected);
};

const defaultQuery: DWorkflowsPageQuery = {
   pagination: { pageNumber: 0, pageSize: 10 },
   filter: undefined,
   sort: undefined,
};

describe("WorkflowItems", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("shows skeleton while loading", () => {
      getWorkflowsPageMock.mockImplementation(
         () => new Promise(() => undefined)
      );

      const { container } = renderWithRouter(
         <WorkflowItems viewMode={DListViewMode.GRID} params={{}} />
      );

      assertSkeletonRendered();
      expect(container).toMatchSnapshot();
   });

   it("shows empty state when no workflows", async () => {
      const page = dtestData.dWorkflowsPage(0);
      getWorkflowsPageMock.mockResolvedValue(page);

      const { container } = renderWithRouter(
         <WorkflowItems viewMode={DListViewMode.GRID} params={{}} />
      );

      await waitFor(() => {
         assertEmptyStateRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("shows workflow cards when workflows exist", async () => {
      const page = dtestData.dWorkflowsPage(3);
      getWorkflowsPageMock.mockResolvedValue(page);

      const { container } = renderWithRouter(
         <WorkflowItems viewMode={DListViewMode.GRID} params={{}} />
      );

      await waitFor(() => {
         assertWorkflowCardsRendered(3);
         assertGetWorkflowsPageCalled(defaultQuery);
      });

      expect(container).toMatchSnapshot();
   });

   it("calls getWorkflowsPage with filter and sort params", async () => {
      const page = dtestData.dWorkflowsPage(1);
      getWorkflowsPageMock.mockResolvedValue(page);

      const params = {
         filters: { search: "test" },
         sort: { field: "title", order: "asc" as const },
      };

      renderWithRouter(
         <WorkflowItems viewMode={DListViewMode.GRID} params={params} />
      );

      const expectedQuery: DWorkflowsPageQuery = {
         pagination: { pageNumber: 0, pageSize: 10 },
         filter: params.filters,
         sort: params.sort,
      };

      await waitFor(() => {
         expect(getWorkflowsPageMock).toHaveBeenCalledTimes(1);
         expect(getWorkflowsPageMock).toHaveBeenCalledWith(expectedQuery);
      });
   });
});

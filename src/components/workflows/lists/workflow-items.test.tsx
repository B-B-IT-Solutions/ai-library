jest.mock("@/data/actions/workflow");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { getWorkflowsPage, getWorkflowsUsage } from "@/data/actions/workflow";
import { DWorkflowsPageQuery } from "@/data/types/domain/workflow";

import { WorkflowItems } from "./workflow-items";

const getWorkflowsPageMock = getWorkflowsPage as jest.MockedFunction<
   typeof getWorkflowsPage
>;
const getWorkflowsUsageMock = getWorkflowsUsage as jest.MockedFunction<
   typeof getWorkflowsUsage
>;

const assertSkeletonRendered = () =>
   assertInDocument(screen.getByTestId("workflows-list-skeleton"));

const assertEmptyStateRendered = () =>
   assertInDocument(screen.getByTestId("workflows-empty-state"));

const assertWorkflowCardsRendered = (count: number) => {
   const workflows = dtestData.dWorkflows(count);
   workflows.forEach((w) =>
      assertInDocument(screen.getByTestId(`workflow-card-${w.id}`)),
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
      getWorkflowsUsageMock.mockResolvedValue(dtestData.dWorkflowsUsage());
   });

   it("shows skeleton while loading", () => {
      getWorkflowsPageMock.mockImplementation(
         () => new Promise(() => undefined),
      );

      const { container } = renderWithRouter(<WorkflowItems />);

      assertSkeletonRendered();
      expect(container).toMatchSnapshot();
   });

   it("shows empty state when no workflows", async () => {
      const page = dtestData.dWorkflowsPage(0);
      getWorkflowsPageMock.mockResolvedValue(page);

      const { container } = renderWithRouter(<WorkflowItems />);

      await waitFor(() => {
         assertEmptyStateRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("hides create button in empty state for free tier", async () => {
      const page = dtestData.dWorkflowsPage(0);
      getWorkflowsPageMock.mockResolvedValue(page);
      getWorkflowsUsageMock.mockResolvedValue({ current: 0, limit: 0 });

      renderWithRouter(<WorkflowItems />);

      await waitFor(() => {
         assertEmptyStateRendered();
      });

      expect(screen.queryByRole("link", { name: /Ersten Workflow erstellen/i })).not.toBeInTheDocument();
   });

   it("shows workflow cards when workflows exist", async () => {
      const page = dtestData.dWorkflowsPage(3);
      getWorkflowsPageMock.mockResolvedValue(page);

      const { container } = renderWithRouter(<WorkflowItems />);

      await waitFor(() => {
         assertWorkflowCardsRendered(3);
         assertGetWorkflowsPageCalled(defaultQuery);
      });

      expect(container).toMatchSnapshot();
   });

   it("calls getWorkflowsPage with correct pagination query", async () => {
      const page = dtestData.dWorkflowsPage(1);
      getWorkflowsPageMock.mockResolvedValue(page);

      renderWithRouter(<WorkflowItems />);

      await waitFor(() => {
         assertGetWorkflowsPageCalled(defaultQuery);
      });
   });
});

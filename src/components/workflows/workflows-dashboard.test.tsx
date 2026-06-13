jest.mock("@/data/actions/workflow");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";

import { getWorkflowsPage, getWorkflowsUsage } from "@/data/actions/workflow";
import { DWorkflowsPageQuery, DWorkflowsUsage } from "@/data/types/domain/workflow";

import { WorkflowsDashboard } from "./workflows-dashboard";

const getWorkflowsPageMock = getWorkflowsPage as jest.MockedFunction<
   typeof getWorkflowsPage
>;
const getWorkflowsUsageMock = getWorkflowsUsage as jest.MockedFunction<
   typeof getWorkflowsUsage
>;

const assertDashboardRendered = () => {
   assertInDocument(screen.getByTestId("workflows-dashboard"));
   assertInDocument(screen.getByTestId("create-workflow-btn"));
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

describe("WorkflowsDashboard", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("renders dashboard with workflows", async () => {
      const page = dtestData.dWorkflowsPage();
      getWorkflowsPageMock.mockResolvedValue(page);
      const usage: DWorkflowsUsage = { current: 2, limit: 10 };
      getWorkflowsUsageMock.mockResolvedValue(usage);

      const { container } = await renderAsyncRSC(WorkflowsDashboard, {});

      await waitFor(() => {
         assertDashboardRendered();
         assertGetWorkflowsPageCalled(defaultQuery);
         expect(getWorkflowsUsageMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("renders dashboard with upgrade required when limit reached", async () => {
      const page = dtestData.dWorkflowsPage();
      getWorkflowsPageMock.mockResolvedValue(page);
      const usage: DWorkflowsUsage = { current: 5, limit: 5 };
      getWorkflowsUsageMock.mockResolvedValue(usage);

      const { container } = await renderAsyncRSC(WorkflowsDashboard, {});

      await waitFor(() => {
         assertDashboardRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("renders dashboard with upgrade not required when limit is -1", async () => {
      const page = dtestData.dWorkflowsPage();
      getWorkflowsPageMock.mockResolvedValue(page);
      const usage: DWorkflowsUsage = { current: 100, limit: -1 };
      getWorkflowsUsageMock.mockResolvedValue(usage);

      const { container } = await renderAsyncRSC(WorkflowsDashboard, {});

      await waitFor(() => {
         assertDashboardRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("renders dashboard when usage fetch fails", async () => {
      const page = dtestData.dWorkflowsPage(0);
      getWorkflowsPageMock.mockResolvedValue(page);
      getWorkflowsUsageMock.mockRejectedValue(new Error("network error"));

      const { container } = await renderAsyncRSC(WorkflowsDashboard, {});

      await waitFor(() => {
         assertDashboardRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

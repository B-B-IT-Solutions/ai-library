jest.mock("@/data/actions/workflow");
jest.mock("./workflows-search-params");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import { getWorkflowsPage, getWorkflowsUsage } from "@/data/actions/workflow";
import { DWorkflowsSortByMode } from "@/data/types/domain/common";
import { DWorkflowsUsage } from "@/data/types/domain/workflow";

import { WorkflowsDashboard } from "./workflows-dashboard";
import { workflowsSearchParamsCache } from "./workflows-search-params";

type CacheKey = Parameters<typeof workflowsSearchParamsCache.get>[0];

const getWorkflowsPageMock = getWorkflowsPage as jest.MockedFunction<
   typeof getWorkflowsPage
>;
const getWorkflowsUsageMock = getWorkflowsUsage as jest.MockedFunction<
   typeof getWorkflowsUsage
>;
const workflowsSearchParamsCacheMock =
   workflowsSearchParamsCache as DeepMockProxy<
      typeof workflowsSearchParamsCache
   >;

const mockSearchParams = (key: CacheKey) => {
   switch (key) {
      case "sort":
         return DWorkflowsSortByMode.DATE_DESC;
      case "f_search":
         return "";
   }
};

const assertDashboardRendered = () => {
   assertInDocument(screen.getByTestId("workflows-dashboard"));
   assertInDocument(screen.getByTestId("create-workflow-btn"));
   assertInDocument(screen.getByTestId("workflows-toolbar"));
};

describe("WorkflowsDashboard", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      workflowsSearchParamsCacheMock.get.mockImplementation(mockSearchParams);
   });

   it("renders dashboard with workflows", async () => {
      const page = dtestData.dWorkflowsPage();
      getWorkflowsPageMock.mockResolvedValue(page);
      const usage: DWorkflowsUsage = { current: 2, limit: 10 };
      getWorkflowsUsageMock.mockResolvedValue(usage);

      const { container } = await renderAsyncRSC(WorkflowsDashboard, {});

      await waitFor(() => {
         assertDashboardRendered();
         expect(getWorkflowsPageMock).toHaveBeenCalledTimes(1);
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

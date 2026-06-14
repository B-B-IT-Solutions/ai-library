jest.mock("@/data/actions/workflow");
jest.mock("./workflows-search-params");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import { getWorkflowsPage, getWorkflowsUsage } from "@/data/actions/workflow";
import {
   DListViewMode,
   DWorkflowsSortByMode,
} from "@/data/types/domain/common";
import {
   DWorkflowsPageQuery,
   DWorkflowsUsage,
} from "@/data/types/domain/workflow";

import { WorkflowsDashboard } from "./workflows-dashboard";
import { workflowsSearchParamsCache } from "./workflows-search-params";

type CacheKey = Parameters<typeof workflowsSearchParamsCache.get>[0];
type CacheValue = ReturnType<typeof workflowsSearchParamsCache.get>;

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

const mockSearchParams = (key: CacheKey): CacheValue => {
   switch (key) {
      case "view":
         return DListViewMode.GRID;
      case "sort":
         return DWorkflowsSortByMode.DATE_DESC;
      case "f_search":
         return "";
   }
};

const assertRendered = () => {
   const dashboard = screen.getByTestId("workflows-dashboard");
   const createBtn = screen.getByTestId("create-workflow-btn");
   const toolbar = screen.getByTestId("workflows-toolbar");
   const items = screen.getByTestId("workflow-items");

   assertInDocument(dashboard);
   assertInDocument(createBtn);
   assertInDocument(toolbar);
   assertInDocument(items);
};

const assertGetWorkflowsPageCalled = (expectedPayload: DWorkflowsPageQuery) => {
   expect(getWorkflowsPageMock).toHaveBeenCalledTimes(1);
   expect(getWorkflowsPageMock).toHaveBeenCalledWith(expectedPayload);
};

describe("WorkflowsDashboard", () => {
   beforeAll(() => {
      const page = dtestData.dWorkflowsPage();
      getWorkflowsPageMock.mockResolvedValue(page);
   });

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("renders - test", async () => {
      workflowsSearchParamsCacheMock.get.mockImplementation(mockSearchParams);

      const usage: DWorkflowsUsage = {
         current: 2,
         limit: 10,
      };
      getWorkflowsUsageMock.mockResolvedValue(usage);

      const { container } = await renderAsyncRSC(WorkflowsDashboard, {});

      const expectedPayload: DWorkflowsPageQuery = {
         pagination: {
            pageNumber: 0,
            pageSize: 10,
         },
         filter: {
            search: mockSearchParams("f_search"),
         },
         sort: {
            field: "createdAt",
            order: "desc",
         },
      };

      await waitFor(() => {
         assertRendered();
         expect(getWorkflowsUsageMock).toHaveBeenCalledTimes(1);
         assertGetWorkflowsPageCalled(expectedPayload);
      });

      expect(container).toMatchSnapshot();
   });
});

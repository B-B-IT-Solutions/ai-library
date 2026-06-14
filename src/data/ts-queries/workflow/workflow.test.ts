jest.mock("@/data/actions/workflow");

import {
   InfiniteData,
   QueryKey,
   UndefinedInitialDataInfiniteOptions,
} from "@tanstack/react-query";
import { waitFor } from "@testing-library/dom";
import { dtestData, renderHookWithReactQuery } from "@tests";

import { getWorkflowsPage } from "@/data/actions/workflow";
import {
   DWorkflowsPage,
   DWorkflowsPageQuery,
} from "@/data/types/domain/workflow";

import { LoadWorkflowsPageParams } from "./types";
import {
   infiniteLoadWorkflowsPageOptions,
   useInfiniteLoadWorkflowsPage,
} from "./workflow";

const getWorkflowsPageMock = getWorkflowsPage as jest.MockedFunction<
   typeof getWorkflowsPage
>;

describe("loadWorkflowsPage hooks tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("infiniteLoadWorkflowsPageOptions - test", async () => {
      const filters = dtestData.dWorkflowsFilter();
      const sort = dtestData.sort();
      const params: LoadWorkflowsPageParams = { filters, sort };

      const expectedOptions: UndefinedInitialDataInfiniteOptions<
         DWorkflowsPage,
         Error,
         InfiniteData<DWorkflowsPage, unknown>,
         QueryKey,
         number
      > = {
         queryKey: ["workflows", { filters, sort }],
         queryFn: jest.fn(),
         initialPageParam: 0,
         getNextPageParam: jest.fn(),
         staleTime: 5 * 60 * 1000,
      };

      const options = infiniteLoadWorkflowsPageOptions(params);
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
   });

   test("useInfiniteLoadWorkflowsPage test", async () => {
      const page = dtestData.dWorkflowsPage();
      getWorkflowsPageMock.mockResolvedValue(page);

      const filters = dtestData.dPromptsFilter();
      const sort = dtestData.sort();
      const params: LoadWorkflowsPageParams = { filters, sort };

      const { result } = renderHookWithReactQuery(() =>
         useInfiniteLoadWorkflowsPage(params)
      );

      const expectedQuery: DWorkflowsPageQuery = {
         pagination: {
            pageNumber: 0,
            pageSize: 10,
         },
         filter: params.filters,
         sort: params.sort,
      };

      await waitFor(() => {
         expect(result.current.data?.pageParams).toEqual([0]);
         expect(result.current.data?.pages).toHaveLength(1);
         expect(result.current.data?.pages[0]).toEqual(page);
         expect(getWorkflowsPageMock).toHaveBeenCalledTimes(1);
         expect(getWorkflowsPageMock).toHaveBeenCalledWith(expectedQuery);
      });
   });
});

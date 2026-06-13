import {
   FetchQueryOptions,
   InfiniteData,
   QueryKey,
   UndefinedInitialDataInfiniteOptions,
   UndefinedInitialDataOptions,
   useInfiniteQuery,
   UseInfiniteQueryResult,
   useQuery,
   UseQueryResult,
} from "@tanstack/react-query";

import { getWorkflowsPage, getWorkflowsUsage } from "@/data/actions/workflow";
import { DWorkflowsPage, DWorkflowsPageQuery, DWorkflowsUsage } from "@/data/types/domain/workflow";
import { INIT_PAGE_NUMBER, PAGE_SIZE } from "@/lib/constants";
import { getNextPageParam, pageQuery } from "../utils";

import type { LoadWorkflowsPageParams } from "./types";
import { workflowKeys } from "./utils";

export const infiniteLoadWorkflowsPageOptions = (
   params: LoadWorkflowsPageParams
): UndefinedInitialDataInfiniteOptions<
   DWorkflowsPage,
   Error,
   InfiniteData<DWorkflowsPage>,
   QueryKey,
   number
> => {
   const { filters, sort } = params;
   return {
      queryKey: workflowKeys.workflowsPage(params),
      queryFn: async ({ pageParam }) => {
         const query: DWorkflowsPageQuery = pageQuery(
            pageParam,
            PAGE_SIZE,
            undefined,
            filters,
            sort
         );
         return await getWorkflowsPage(query);
      },
      initialPageParam: INIT_PAGE_NUMBER,
      getNextPageParam,
      staleTime: 5 * 60 * 1000,
   };
};

export const useInfiniteLoadWorkflowsPage = (
   params: LoadWorkflowsPageParams
): UseInfiniteQueryResult<InfiniteData<DWorkflowsPage>, Error> => {
   return useInfiniteQuery(infiniteLoadWorkflowsPageOptions(params));
};

export const loadWorkflowsUsageOptions = (): FetchQueryOptions<DWorkflowsUsage> => ({
   queryKey: workflowKeys.usage(),
   queryFn: getWorkflowsUsage,
});

export const workflowsUsageQueryOptions =
   (): UndefinedInitialDataOptions<DWorkflowsUsage> => ({
      queryKey: workflowKeys.usage(),
      queryFn: getWorkflowsUsage,
      staleTime: 5 * 60 * 1000,
   });

export const useLoadWorkflowsUsage = (): UseQueryResult<DWorkflowsUsage> => {
   return useQuery(workflowsUsageQueryOptions());
};

import {
   FetchQueryOptions,
   UndefinedInitialDataOptions,
   useQuery,
   UseQueryResult,
} from "@tanstack/react-query";

import { getWorkflows, getWorkflowsUsage } from "@/data/actions/workflow";
import { DWorkflow, DWorkflowsUsage } from "@/data/types/domain/workflow";

import { workflowKeys } from "./utils";

export const loadWorkflowsOptions = (): FetchQueryOptions<DWorkflow[]> => ({
   queryKey: workflowKeys.workflows(),
   queryFn: getWorkflows,
});

export const workflowsQueryOptions = (): UndefinedInitialDataOptions<
   DWorkflow[]
> => ({
   queryKey: workflowKeys.workflows(),
   queryFn: getWorkflows,
   staleTime: 5 * 60 * 1000,
});

export const useLoadWorkflows = (): UseQueryResult<DWorkflow[]> => {
   return useQuery(workflowsQueryOptions());
};

export const loadWorkflowsUsageOptions =
   (): FetchQueryOptions<DWorkflowsUsage> => ({
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

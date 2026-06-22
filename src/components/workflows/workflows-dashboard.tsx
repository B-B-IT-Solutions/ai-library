import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";

import { getWorkflowsUsage } from "@/data/actions/workflow";
import { resolveSort } from "@/data/ts-queries/utils";
import {
   infiniteLoadWorkflowsPageOptions,
   type LoadWorkflowsPageParams,
} from "@/data/ts-queries/workflow";
import { DWorkflowsFilter } from "@/data/types/domain/workflow";

import { CreateWorfklowButton } from "./buttons";
import { WorkflowItems, WorkflowsToolbar } from "./lists";
import { workflowsSearchParamsCache } from "./workflows-search-params";

export const WorkflowsDashboard = async () => {
   const queryClient = new QueryClient();

   const viewMode = workflowsSearchParamsCache.get("view");
   const sortMode = workflowsSearchParamsCache.get("sort");

   const filters: DWorkflowsFilter = {
      search: workflowsSearchParamsCache.get("f_search"),
   };

   const params: LoadWorkflowsPageParams = {
      filters,
      sort: resolveSort(sortMode),
   };

   await Promise.all([
      queryClient.prefetchInfiniteQuery(
         infiniteLoadWorkflowsPageOptions(params)
      ),
   ]);

   const usage = await getWorkflowsUsage();

   const isUpgradeRequired =
      usage != null && usage.limit !== -1 && usage.current >= usage.limit;

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div
            className="flex h-full flex-col bg-slate-50"
            data-testid="workflows-dashboard"
         >
            <div className="flex items-center justify-between border-b bg-white px-4 py-3 sm:px-6 sm:py-4">
               <div>
                  <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                     Meine Workflows
                  </h1>
                  <p className="mt-0.5 hidden text-sm text-slate-600 sm:mt-1 sm:block">
                     Verbinde mehrere Prompts zu einem geführten Prozess
                  </p>
               </div>
               <div className="flex items-center gap-3">
                  <CreateWorfklowButton
                     requirePlanUpgrade={isUpgradeRequired}
                  />
               </div>
            </div>

            <WorkflowsToolbar viewMode={viewMode} />

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
               <WorkflowItems
                  viewMode={viewMode}
                  filters={filters}
                  sortMode={sortMode}
               />
            </div>
         </div>
      </HydrationBoundary>
   );
};

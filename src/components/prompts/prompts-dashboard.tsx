import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";

import { infiniteLoadPromptsOptions } from "@/data/ts-queries/prompt/prompt";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { DPrompt0sFilter } from "@/data/types/domain/prompt";

import { CreatePromptButton } from "./buttons";
import { Prompts, PromptsToolbar } from "./lists";

export const PromptsDashboard = async () => {
   const queryClient = new QueryClient();

   await Promise.all([
      queryClient.prefetchInfiniteQuery(infiniteLoadPromptsOptions({})),
   ]);

   const viewMode = DListViewMode.GRID;
   const groupBy = DListGroupByMode.NONE;
   const sortBy = DListSortByMode.DATE_DESC;
   const filters: DPrompt0sFilter = {};

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div
            className="flex h-full flex-col bg-slate-50"
            data-testid="prompts-dashboard"
         >
            <div className="space-y-4 border-b bg-white px-6 py-4">
               <div className="flex items-center justify-between">
                  <div>
                     <h1 className="text-2xl font-bold text-slate-900">
                        Meine Prompts
                     </h1>
                     <p className="mt-1 text-sm text-slate-600">
                        Verwalten Sie Ihre gespeicherten Prompts
                     </p>
                  </div>
                  <div className="flex items-center gap-3">
                     <CreatePromptButton />
                  </div>
               </div>
            </div>

            <PromptsToolbar
               viewMode={viewMode}
               filters={filters}
               categories={[]}
               models={[]}
            />

            <div className="flex-1 overflow-y-auto">
               <Prompts
                  viewMode={viewMode}
                  groupBy={groupBy}
                  sortBy={sortBy}
                  filters={filters}
               />
            </div>
         </div>
      </HydrationBoundary>
   );
};

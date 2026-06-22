import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";

import { getCollectionPreviews } from "@/data/actions/collection";
import {
   getPromptCategories,
   getPromptModels,
   getPromptsUsage,
} from "@/data/actions/prompt";
import { infiniteLoadPromptsPageOptions } from "@/data/ts-queries/prompt";
import { resolveSort } from "@/data/ts-queries/utils";
import { DPromptsFilter } from "@/data/types/domain/prompt";

import { CreatePromptButton } from "./buttons";
import { PromptItems, PromptsToolbar } from "./lists";
import { templatesSearchParamsCache } from "./search-params";

export const PromptsDashboard = async () => {
   const queryClient = new QueryClient();

   const viewMode = templatesSearchParamsCache.get("view");
   const groupBy = templatesSearchParamsCache.get("group");
   const sortBy = templatesSearchParamsCache.get("sort");

   const filters: DPromptsFilter = {
      search: templatesSearchParamsCache.get("f_search"),
      categories: templatesSearchParamsCache.get("f_categories"),
      models: templatesSearchParamsCache.get("f_models"),
      collectionIds: templatesSearchParamsCache.get("f_collectionIds"),
   };

   await Promise.all([
      queryClient.prefetchInfiniteQuery(
         infiniteLoadPromptsPageOptions({
            filters,
            sort: resolveSort(sortBy),
         })
      ),
   ]);

   const [categories, models, collections, usage] = await Promise.all([
      getPromptCategories(),
      getPromptModels(),
      getCollectionPreviews(),
      getPromptsUsage(),
   ]);

   const isUpgradeRequired = usage.limit !== -1 && usage.current >= usage.limit;

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div
            className="flex h-full flex-col bg-slate-50"
            data-testid="prompts-dashboard"
         >
            <div className="flex items-center justify-between border-b bg-white px-4 py-3 sm:px-6 sm:py-4">
               <div>
                  <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                     Meine Prompts
                  </h1>
                  <p className="mt-0.5 hidden text-sm text-slate-600 sm:mt-1 sm:block">
                     Verwalten Sie Ihre gespeicherten Prompts
                  </p>
               </div>
               <div className="flex items-center gap-3">
                  <CreatePromptButton requirePlanUpgrade={isUpgradeRequired} />
               </div>
            </div>

            <PromptsToolbar
               viewMode={viewMode}
               sortBy={sortBy}
               categories={categories}
               models={models}
               collections={collections}
            />

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
               <PromptItems
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

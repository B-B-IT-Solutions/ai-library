import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";

import {
   getPromptsUsage,
   getTemplateDescriptorCategories,
   getTemplateDescriptorModels,
} from "@/data/actions/prompt";
import { preloadCollectionsOptions } from "@/data/ts-queries/library";
import { infiniteLoadTemplateDescriptorsOptions } from "@/data/ts-queries/prompt";
import { resolveSort } from "@/data/ts-queries/utils";
import { DPromptsFilter } from "@/data/types/domain/prompt";
import { cn } from "@/lib/utils";

import { CreateTemplateButton } from "./buttons";
import { CollectionsFilter, TemplateItems, TemplatesToolbar } from "./lists";
import { templatesSearchParamsCache } from "./search-params";

export const TemplatesDashboard = async () => {
   const queryClient = new QueryClient();

   const viewMode = templatesSearchParamsCache.get("view");
   const groupBy = templatesSearchParamsCache.get("group");
   const sortBy = templatesSearchParamsCache.get("sort");

   const filters: DPromptsFilter = {
      search: templatesSearchParamsCache.get("f_search"),
      categories: templatesSearchParamsCache.get("f_categories"),
      models: templatesSearchParamsCache.get("f_models"),
   };

   await Promise.all([
      queryClient.prefetchInfiniteQuery(
         infiniteLoadTemplateDescriptorsOptions({
            filters,
            sort: resolveSort(sortBy),
         })
      ),
      queryClient.prefetchQuery(preloadCollectionsOptions()),
   ]);

   const categories = await getTemplateDescriptorCategories();
   const models = await getTemplateDescriptorModels();
   const usage = await getPromptsUsage();

   const isAtLimit = usage.limit !== -1 && usage.current >= usage.limit;

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div
            className="flex h-full flex-col bg-slate-50"
            data-testid="templates-dashboard"
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
                     <p
                        className={cn(
                           "mt-1 text-xs",
                           isAtLimit ? "text-red-500" : "text-slate-400"
                        )}
                        data-testid="template-usage-indicator"
                     >
                        {usage.limit === -1
                           ? `${usage.current} Vorlagen`
                           : `${usage.current} / ${usage.limit} Vorlagen`}
                     </p>
                  </div>
                  <div className="flex items-center gap-3">
                     <CreateTemplateButton atLimit={isAtLimit} />
                  </div>
               </div>

               <CollectionsFilter filters={filters} />
            </div>

            <TemplatesToolbar
               viewMode={viewMode}
               filters={filters}
               categories={categories}
               models={models}
            />

            <div className="flex-1 overflow-y-auto p-6">
               <TemplateItems
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

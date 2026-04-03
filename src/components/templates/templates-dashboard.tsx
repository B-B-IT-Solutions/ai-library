import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";

import {
   getTemplateDescriptorCategories,
   getTemplateDescriptorModels,
} from "@/data/actions/prompt-template";
import {
   infiniteLoadLibraryEntriesOptions,
   preloadLibraryCollectionsOptions,
} from "@/data/ts-queries/library";
import { resolveSort } from "@/data/ts-queries/utils";
import { DTemplateDescriptorsFilter } from "@/data/types/domain/prompt.template";

import { CreateLibraryEntryButton } from "./buttons";
import { CollectionsFilter, TemplateItems, TemplatesToolbar } from "./lists";
import { templatesSearchParamsCache } from "./search-params";

export const TemplatesDashboard = async () => {
   const queryClient = new QueryClient();

   const viewMode = templatesSearchParamsCache.get("view");
   const groupBy = templatesSearchParamsCache.get("group");
   const sortBy = templatesSearchParamsCache.get("sort");

   const filters: DTemplateDescriptorsFilter = {
      search: templatesSearchParamsCache.get("f_search"),
      categories: templatesSearchParamsCache.get("f_categories"),
      models: templatesSearchParamsCache.get("f_models"),
   };

   await Promise.all([
      queryClient.prefetchInfiniteQuery(
         infiniteLoadLibraryEntriesOptions({
            filters,
            sort: resolveSort(sortBy),
         })
      ),
      queryClient.prefetchQuery(preloadLibraryCollectionsOptions()),
   ]);

   const categories = await getTemplateDescriptorCategories();
   const models = await getTemplateDescriptorModels();

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
                        Meine Prompt-Vorlagen
                     </h1>
                     <p className="mt-1 text-sm text-slate-600">
                        Verwalten Sie Ihre gespeicherten Prompt-Vorlagen
                     </p>
                  </div>
                  <div className="flex items-center gap-3">
                     <CreateLibraryEntryButton />
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

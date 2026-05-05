import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";

import {
   getTemplateDescriptorCategories,
   getTemplateDescriptorModels,
} from "@/data/actions/template";
import { preloadCollectionsOptions } from "@/data/ts-queries/library";
import { infiniteLoadTemplateDescriptorsOptions } from "@/data/ts-queries/template";
import { resolveSort } from "@/data/ts-queries/utils";
import { DCatalogEntriesFilter } from "@/data/types/domain/catalog";

import { CreateTemplateButton } from "./buttons";
import { exploreSearchParamsCache } from "./explore-search-params";
import { CollectionsFilter, TemplateItems, TemplatesToolbar } from "./lists";

export const CatalogEntriesDashboard = async () => {
   const queryClient = new QueryClient();

   const viewMode = exploreSearchParamsCache.get("view");
   const groupBy = exploreSearchParamsCache.get("group");
   const sortBy = exploreSearchParamsCache.get("sort");

   const filters: DCatalogEntriesFilter = {
      search: exploreSearchParamsCache.get("search"),
      categories: exploreSearchParamsCache.get("category"),
      models: exploreSearchParamsCache.get("f_models"),
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

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div
            className="flex h-full flex-col bg-slate-50"
            data-testid="catalog-entries-dashboard"
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
                     <CreateTemplateButton />
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

import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";

import { getCatalogEntryCategories } from "@/data/actions/catalog";
import { infiniteLoadCatalogEntryDescriptorsOptions } from "@/data/ts-queries/catalog";
import { resolveSort } from "@/data/ts-queries/utils";
import { DCatalogEntriesFilter } from "@/data/types/domain/catalog";

import { catalogEntrySearchParamsCache } from "./catalog-search-params";
import { CatalogEntriesFilter, CatalogEntryItems } from "./lists";

export const CatalogEntriesDashboard = async () => {
   const queryClient = new QueryClient();

   const viewMode = catalogEntrySearchParamsCache.get("view");
   const groupBy = catalogEntrySearchParamsCache.get("group");
   const sortBy = catalogEntrySearchParamsCache.get("sort");

   const filters: DCatalogEntriesFilter = {
      search: catalogEntrySearchParamsCache.get("f_search"),
      categories: catalogEntrySearchParamsCache.get("f_categories"),
   };

   await Promise.all([
      queryClient.prefetchInfiniteQuery(
         infiniteLoadCatalogEntryDescriptorsOptions({
            filters,
            sort: resolveSort(sortBy),
         })
      ),
   ]);

   const categories = await getCatalogEntryCategories();

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
               </div>
            </div>

            <CatalogEntriesFilter categories={categories} totalElements={1} />

            <div className="flex-1 overflow-y-auto p-6">
               <CatalogEntryItems
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

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
import { CatalogEntriesToolbar, CatalogEntryItems, CatalogSidebar } from "./lists";

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
            className="flex gap-6"
            data-testid="catalog-entries-dashboard"
         >
            <CatalogSidebar categories={categories} totalElements={1} />

            <div className="min-w-0 flex-1">
               <CatalogEntriesToolbar viewMode={viewMode} />
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

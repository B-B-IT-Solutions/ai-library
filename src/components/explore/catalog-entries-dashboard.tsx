import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";

import { isAuthenticated } from "@/data/actions/auth-utils";
import { getCatalogEntryCategories } from "@/data/actions/catalog";
import { infiniteLoadCatalogEntryDescriptorsOptions } from "@/data/ts-queries/catalog";
import { resolveSort } from "@/data/ts-queries/utils";
import { DCatalogEntriesFilter } from "@/data/types/domain/catalog";

import { catalogEntrySearchParamsCache } from "./catalog-search-params";
import {
   CatalogEntriesToolbar,
   CatalogEntryItems,
   CatalogSidebar,
} from "./lists";

export const CatalogEntriesDashboard = async () => {
   const queryClient = new QueryClient();

   const viewMode = catalogEntrySearchParamsCache.get("view");
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

   const [categories, authenticated] = await Promise.all([
      getCatalogEntryCategories(),
      isAuthenticated(),
   ]);

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div className="flex gap-6" data-testid="catalog-entries-dashboard">
            <CatalogSidebar categories={categories} />

            <div className="min-w-0 flex-1">
               <CatalogEntriesToolbar
                  viewMode={viewMode}
                  categories={categories}
               />
               <CatalogEntryItems
                  viewMode={viewMode}
                  sortBy={sortBy}
                  filters={filters}
                  authenticated={authenticated}
               />
            </div>
         </div>
      </HydrationBoundary>
   );
};

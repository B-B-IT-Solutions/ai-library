import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";

import { infiniteLoadCollectionsPageOptions } from "@/data/ts-queries/collection";
import { resolveSort } from "@/data/ts-queries/utils";
import { DCollectionsFilter } from "@/data/types/domain/collection";

import { CreateCollectionButton } from "./buttons";
import { collectionsSearchParamsCache } from "./collections-search-params";
import { CollectionItems, CollectionsToolbar } from "./lists";

export const CollectionsDashboard = async () => {
   const queryClient = new QueryClient();

   const viewMode = collectionsSearchParamsCache.get("view");
   const sortMode = collectionsSearchParamsCache.get("sort");

   const filters: DCollectionsFilter = {
      search: collectionsSearchParamsCache.get("f_search"),
   };

   await queryClient.prefetchInfiniteQuery(
      infiniteLoadCollectionsPageOptions({
         filters,
         sort: resolveSort(sortMode),
      })
   );

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div
            className="flex h-full flex-col bg-slate-50"
            data-testid="collections-dashboard"
         >
            <div className="border-b bg-white px-4 py-3 sm:px-6 sm:py-4">
               <div className="flex items-center justify-between">
                  <div>
                     <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                        Meine Sammlungen
                     </h1>
                     <p className="mt-0.5 hidden text-sm text-slate-600 sm:mt-1 sm:block">
                        Organisieren Sie Ihre Vorlagen in Sammlungen
                     </p>
                  </div>
                  <div className="flex items-center gap-3">
                     <CreateCollectionButton />
                  </div>
               </div>
            </div>

            <CollectionsToolbar viewMode={viewMode} />

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
               <CollectionItems
                  viewMode={viewMode}
                  sortMode={sortMode}
                  filters={filters}
               />
            </div>
         </div>
      </HydrationBoundary>
   );
};

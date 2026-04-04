import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";

import { preloadCollectionsOptions } from "@/data/ts-queries/library";

import { CreateCollectionButton } from "./buttons";
import { collectionsSearchParamsCache } from "./collections-search-params";
import { CollectionItems, CollectionsToolbar } from "./lists";

export const CollectionsDashboard = async () => {
   const queryClient = new QueryClient();
   await queryClient.prefetchQuery(preloadCollectionsOptions());

   const viewMode = collectionsSearchParamsCache.get("view");

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div
            className="flex h-full flex-col bg-slate-50"
            data-testid="collections-dashboard"
         >
            <div className="space-y-4 border-b bg-white px-6 py-4">
               <div className="flex items-center justify-between">
                  <div>
                     <h1 className="text-2xl font-bold text-slate-900">
                        Sammlungen
                     </h1>
                     <p className="mt-1 text-sm text-slate-600">
                        Organisieren Sie Ihre Vorlagen in Sammlungen
                     </p>
                  </div>
                  <div className="flex items-center gap-3">
                     <CreateCollectionButton />
                  </div>
               </div>
            </div>

            <CollectionsToolbar viewMode={viewMode} />

            <div className="flex-1 overflow-y-auto p-6">
               <CollectionItems />
            </div>
         </div>
      </HydrationBoundary>
   );
};

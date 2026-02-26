import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";

import { getLibraryCategories, getLibraryModels } from "@/data/actions/library";
import {
   infiniteLoadLibraryEntriesOptions,
   preloadLibraryCollectionsOptions,
} from "@/data/ts-queries/library";
import { DLibraryEntriesFilter } from "@/data/types/domain/library";

import { CreateLibraryEntryButton } from "./buttons";
import { CollectionsFilter, LibraryEntries, LibraryToolbar } from "./lists";
import { librarySearchParamsCache } from "./search-params";

export const LibraryDashboard = async () => {
   const queryClient = new QueryClient();

   const viewMode = librarySearchParamsCache.get("view");
   const groupBy = librarySearchParamsCache.get("group");
   const sortBy = librarySearchParamsCache.get("sort");

   const filters: DLibraryEntriesFilter = {
      search: librarySearchParamsCache.get("f_search"),
      categories: librarySearchParamsCache.get("f_categories"),
      models: librarySearchParamsCache.get("f_models"),
   };

   await Promise.all([
      queryClient.prefetchInfiniteQuery(
         infiniteLoadLibraryEntriesOptions({ filters })
      ),
      queryClient.prefetchQuery(preloadLibraryCollectionsOptions()),
   ]);

   const categories = await getLibraryCategories();
   const models = await getLibraryModels();

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div
            className="flex h-full flex-col bg-slate-50"
            data-testid="library-dashboard"
         >
            <div className="space-y-4 border-b bg-white px-6 py-4">
               <div className="flex items-center justify-between">
                  <div>
                     <h1 className="text-2xl font-bold text-slate-900">
                        Meine Bibliothek
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

            <LibraryToolbar
               viewMode={viewMode}
               filters={filters}
               categories={categories}
               models={models}
            />

            <div className="flex-1 overflow-y-auto">
               <LibraryEntries
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

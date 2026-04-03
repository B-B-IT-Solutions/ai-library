import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { getLibraryCollectionById } from "@/data/actions/library";
import {
   getTemplateDescriptorCategories,
   getTemplateDescriptorModels,
} from "@/data/actions/prompt-template";
import {
   infiniteLoadLibraryEntriesOptions,
   preloadLibraryCollectionsOptions,
} from "@/data/ts-queries/library";
import { libraryKeys } from "@/data/ts-queries/library/utils";
import { resolveSort } from "@/data/ts-queries/utils";
import { DTemplateDescriptorsFilter } from "@/data/types/domain/prompt.template";

import { CollectionHeader } from "./collections/collection-header";
import { TemplateItems, TemplatesToolbar } from "./lists";
import { templatesSearchParamsCache } from "./search-params";

type Props = {
   collectionId: string;
};

export const CollectionDashboard = async ({ collectionId }: Props) => {
   const collection = await getLibraryCollectionById(collectionId);
   if (!collection) {
      notFound();
   }

   const queryClient = new QueryClient();
   const viewMode = templatesSearchParamsCache.get("view");
   const groupBy = templatesSearchParamsCache.get("group");
   const sortBy = templatesSearchParamsCache.get("sort");

   const filters: DTemplateDescriptorsFilter = {
      search: templatesSearchParamsCache.get("f_search"),
      categories: templatesSearchParamsCache.get("f_categories"),
      models: templatesSearchParamsCache.get("f_models"),
      collectionIds: [collectionId],
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

   queryClient.setQueryData(libraryKeys.collection(collectionId), collection);

   const categories = await getTemplateDescriptorCategories();
   const models = await getTemplateDescriptorModels();

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div
            className="flex h-full flex-col bg-slate-50"
            data-testid="collection-dashboard"
         >
            <div className="space-y-4 border-b bg-white px-6 py-4">
               <CollectionHeader collection={collection} />
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

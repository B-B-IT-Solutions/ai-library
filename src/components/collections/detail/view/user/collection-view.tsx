import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";

import { TemplateItems, TemplatesToolbar } from "@/components/templates/lists";
import { templatesSearchParamsCache } from "@/components/templates/search-params";
import {
   getTemplateDescriptorCategories,
   getTemplateDescriptorModels,
} from "@/data/actions/prompt";
import { libraryKeys } from "@/data/ts-queries/library/utils";
import { infiniteLoadTemplateDescriptorsOptions } from "@/data/ts-queries/template";
import { resolveSort } from "@/data/ts-queries/utils";
import { DCollection } from "@/data/types/domain/collection";
import { DPromptsFilter } from "@/data/types/domain/prompt";

import { CollectionHeader } from "./collection-header";

type Props = {
   collection: DCollection;
};

export const CollectionView = async ({ collection }: Props) => {
   const viewMode = templatesSearchParamsCache.get("view");
   const groupBy = templatesSearchParamsCache.get("group");
   const sortBy = templatesSearchParamsCache.get("sort");

   const filters: DPromptsFilter = {
      search: templatesSearchParamsCache.get("f_search"),
      categories: templatesSearchParamsCache.get("f_categories"),
      models: templatesSearchParamsCache.get("f_models"),
      collectionIds: [collection.id],
   };

   const queryClient = new QueryClient();

   await Promise.all([
      queryClient.prefetchInfiniteQuery(
         infiniteLoadTemplateDescriptorsOptions({
            filters,
            sort: resolveSort(sortBy),
         })
      ),
   ]);

   queryClient.setQueryData(libraryKeys.collection(collection.id), collection);

   const categories = await getTemplateDescriptorCategories();
   const models = await getTemplateDescriptorModels();

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div className="flex h-full flex-col" data-testid="collection-view">
            <div className="border-b bg-white px-6 py-4">
               <CollectionHeader collection={collection} />
            </div>

            <TemplatesToolbar
               viewMode={viewMode}
               filters={filters}
               categories={categories}
               models={models}
            />

            <div className="flex-1 overflow-y-auto px-8 py-6">
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

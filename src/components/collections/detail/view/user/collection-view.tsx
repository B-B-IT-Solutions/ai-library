import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";

import { PromptsToolbar, TemplateItems } from "@/components/prompts/lists";
import { templatesSearchParamsCache } from "@/components/prompts/search-params";
import { getPromptCategories, getPromptModels } from "@/data/actions/prompt";
import { libraryKeys } from "@/data/ts-queries/library/utils";
import { infiniteLoadTemplateDescriptorsOptions } from "@/data/ts-queries/prompt";
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

   const categories = await getPromptCategories();
   const models = await getPromptModels();

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div className="flex h-full flex-col" data-testid="collection-view">
            <div className="border-b bg-white px-6 py-4">
               <CollectionHeader collection={collection} />
            </div>

            <PromptsToolbar
               viewMode={viewMode}
               categories={categories}
               models={models}
               collections={[]}
            />

            <div className="flex-1 overflow-y-auto px-8 py-6">
               <TemplateItems
                  viewMode={viewMode}
                  groupBy={groupBy}
                  sortBy={sortBy}
                  filters={filters}
                  currentCollection={collection}
               />
            </div>
         </div>
      </HydrationBoundary>
   );
};

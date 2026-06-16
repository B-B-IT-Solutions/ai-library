import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";

import { PublicPromptItems } from "@/components/prompts/lists";
import { infiniteLoadPublicTemplateDescriptorsOptions } from "@/data/ts-queries/prompt";
import { resolveSort } from "@/data/ts-queries/utils";
import { DCollection } from "@/data/types/domain/collection";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { DPromptsFilter } from "@/data/types/domain/prompt";

import { PublicCollectionHeader } from "./collection-header-public";

type Props = {
   collection: DCollection;
};

export const CollectionViewPublic = async ({ collection }: Props) => {
   const viewMode = DListViewMode.GRID;
   const groupBy = DListGroupByMode.NONE;
   const sortBy = DListSortByMode.DATE_ASC;

   const filters: DPromptsFilter = {
      collectionIds: [collection.id],
   };

   const queryClient = new QueryClient();

   await Promise.all([
      queryClient.prefetchInfiniteQuery(
         infiniteLoadPublicTemplateDescriptorsOptions({
            filters,
            sort: resolveSort(sortBy),
         })
      ),
   ]);

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div data-testid="collection-view-public">
            <div className="border-b">
               <div className="container mx-auto max-w-6xl px-4 py-8">
                  <PublicCollectionHeader collection={collection} />
               </div>
            </div>

            <div className="max-w-8xl container mx-auto px-4 py-8">
               <PublicPromptItems
                  viewMode={viewMode}
                  groupBy={groupBy}
                  sortBy={sortBy}
                  filters={filters}
                  collectionToken={collection.publicToken}
               />
            </div>
         </div>
      </HydrationBoundary>
   );
};

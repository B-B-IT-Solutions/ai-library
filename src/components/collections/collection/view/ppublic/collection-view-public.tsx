import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";

import { PublicTemplateItems } from "@/components/templates/lists";
import { infiniteLoadPublicTemplateDescriptorsOptions } from "@/data/ts-queries/template";
import { resolveSort } from "@/data/ts-queries/utils";
import { DCollection } from "@/data/types/domain/collection";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { DTemplateDescriptorsFilter } from "@/data/types/domain/prompt.template";

import { PublicCollectionHeader } from "./collection-header-public";

type Props = {
   collection: DCollection;
};

export const CollectionViewPublic = async ({ collection }: Props) => {
   const viewMode = DListViewMode.GRID;
   const groupBy = DListGroupByMode.NONE;
   const sortBy = DListSortByMode.DATE_ASC;

   const filters: DTemplateDescriptorsFilter = {
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

            <div className="container mx-auto max-w-6xl px-4 py-8">
               <PublicTemplateItems
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

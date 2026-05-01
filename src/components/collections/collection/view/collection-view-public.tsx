import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";
import { ArrowLeft, Folder, Globe } from "lucide-react";
import Link from "next/link";

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

type Props = {
   collection: DCollection;
};

export const CollectionViewPublic = async ({ collection }: Props) => {
   const iconColor = collection.color;

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
            {/* Collection header */}
            <div className="border-b bg-white">
               <div className="container mx-auto max-w-6xl px-4 py-8">
                  <Link
                     href="/p/marketplace"
                     className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                     <ArrowLeft className="h-3.5 w-3.5" />
                     Zurück zum Marketplace
                  </Link>

                  <div className="flex items-start gap-5">
                     <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm"
                        style={{ backgroundColor: `${iconColor}20` }}
                     >
                        <Folder
                           className="h-7 w-7"
                           style={{ color: iconColor }}
                        />
                     </div>
                     <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                           <h1 className="text-2xl font-bold text-slate-900">
                              {collection.name}
                           </h1>
                           <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                              <Globe className="h-3 w-3" />
                              Öffentlich
                           </span>
                        </div>
                        {collection.description && (
                           <p className="mt-1.5 text-slate-500">
                              {collection.description}
                           </p>
                        )}
                     </div>
                  </div>
               </div>
            </div>

            {/* Template grid */}
            <div className="container mx-auto max-w-6xl px-4 py-8">
               <PublicTemplateItems
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

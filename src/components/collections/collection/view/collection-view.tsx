import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";
import { Folder } from "lucide-react";

import { TemplateItems, TemplatesToolbar } from "@/components/templates/lists";
import { templatesSearchParamsCache } from "@/components/templates/search-params";
import {
   getTemplateDescriptorCategories,
   getTemplateDescriptorModels,
} from "@/data/actions/prompt-template";
import {
   infiniteLoadTemplateDescriptorsOptions,
   preloadCollectionsOptions,
} from "@/data/ts-queries/library";
import { libraryKeys } from "@/data/ts-queries/library/utils";
import { resolveSort } from "@/data/ts-queries/utils";
import { DCollection } from "@/data/types/domain/collection";
import { DTemplateDescriptorsFilter } from "@/data/types/domain/prompt.template";

import { CollectionHeader } from "./collection-header";

type Props = {
   collection: DCollection;
};

export const CollectionView = async ({ collection }: Props) => {
   const queryClient = new QueryClient();
   const viewMode = templatesSearchParamsCache.get("view");
   const groupBy = templatesSearchParamsCache.get("group");
   const sortBy = templatesSearchParamsCache.get("sort");

   const filters: DTemplateDescriptorsFilter = {
      search: templatesSearchParamsCache.get("f_search"),
      categories: templatesSearchParamsCache.get("f_categories"),
      models: templatesSearchParamsCache.get("f_models"),
      collectionIds: [collection.id],
   };

   await Promise.all([
      queryClient.prefetchInfiniteQuery(
         infiniteLoadTemplateDescriptorsOptions({
            filters,
            sort: resolveSort(sortBy),
         })
      ),
      queryClient.prefetchQuery(preloadCollectionsOptions()),
   ]);

   queryClient.setQueryData(libraryKeys.collection(collection.id), collection);

   const categories = await getTemplateDescriptorCategories();
   const models = await getTemplateDescriptorModels();

   const accentColor = collection.color ?? "#64748b";

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div
            className="flex h-full flex-col bg-slate-50"
            data-testid="collection-dashboard"
         >
            <div
               className="border-b px-6 py-6"
               style={{
                  background: `linear-gradient(135deg, ${accentColor}22 0%, ${accentColor}08 100%)`,
                  borderBottomColor: `${accentColor}40`,
               }}
            >
               <CollectionHeader collection={collection} />
            </div>

            <TemplatesToolbar
               viewMode={viewMode}
               filters={filters}
               categories={categories}
               models={models}
            />

            <div className="flex-1 overflow-y-auto">
               <div className="flex items-center gap-3 px-6 py-4">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="flex items-center gap-1.5 text-sm text-slate-500">
                     <Folder
                        className="h-4 w-4"
                        style={{ color: accentColor }}
                     />
                     {collection.templateCount}{" "}
                     {collection.templateCount === 1 ? "Vorlage" : "Vorlagen"}{" "}
                     in dieser Sammlung
                  </span>
                  <div className="h-px flex-1 bg-slate-200" />
               </div>

               <div className="px-6 pb-6">
                  <TemplateItems
                     viewMode={viewMode}
                     groupBy={groupBy}
                     sortBy={sortBy}
                     filters={filters}
                  />
               </div>
            </div>
         </div>
      </HydrationBoundary>
   );
};

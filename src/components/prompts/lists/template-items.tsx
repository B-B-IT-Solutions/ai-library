"use client";

import { useMemo } from "react";
import { flatMap, isEmpty } from "es-toolkit/compat";

import InfiniteScroll from "@/components/shadcn/infinite-scroll";
import { useLoadCollections } from "@/data/ts-queries/library";
import { useInfiniteLoadTemplateDescriptors } from "@/data/ts-queries/prompt";
import { resolveSort } from "@/data/ts-queries/utils";
import { DCollectionPreview } from "@/data/types/domain/collection";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { DPromptsFilter } from "@/data/types/domain/prompt";

import { TemplateItemsGrid } from "./template-items-grid";
import { TemplateItemsList } from "./template-items-list";

type Props = {
   viewMode: DListViewMode;
   groupBy: DListGroupByMode;
   sortBy: DListSortByMode;
   filters: DPromptsFilter;
   currentCollection?: DCollectionPreview;
};

export const TemplateItems = ({
   viewMode,
   sortBy,
   filters,
   currentCollection,
}: Props) => {
   const { data: collections = [] } = useLoadCollections();
   const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
      useInfiniteLoadTemplateDescriptors({
         filters,
         sort: resolveSort(sortBy),
      });

   const prompts = useMemo(
      () => flatMap(data?.pages, (page) => page.content),
      [data]
   );

   const hasActiveFilters = useMemo(
      () =>
         !isEmpty(filters.search) ||
         !isEmpty(filters.categories) ||
         !isEmpty(filters.models) ||
         !isEmpty(filters.collectionIds),
      [filters]
   );

   if (isLoading) {
      return (
         <div className="flex items-center justify-center py-16">
            <div className="text-center">
               <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
               <p className="mt-4 text-sm text-slate-600">Lädt Vorlagen...</p>
            </div>
         </div>
      );
   }

   if (isEmpty(prompts)) {
      if (hasActiveFilters) {
         return (
            <div
               className="flex flex-col items-center justify-center py-16 text-center"
               data-testid="prompt-items-filter-empty"
            >
               <p className="text-lg font-medium text-slate-700">
                  Keine Ergebnisse für diese Filter
               </p>
               <p className="mt-2 text-sm text-slate-500">
                  Passe deine Filterkriterien an oder setze sie zurück.
               </p>
            </div>
         );
      }
      return (
         <div
            className="flex flex-col items-center justify-center py-16 text-center"
            data-testid="prompt-items-empty"
         >
            <p className="text-lg font-medium text-slate-700">
               Noch keine Prompts
            </p>
            <p className="mt-2 text-sm text-slate-500">
               Erstelle deinen ersten Prompt und baue deine persönliche
               Bibliothek auf.
            </p>
         </div>
      );
   }

   if (viewMode === DListViewMode.LIST) {
      return (
         <InfiniteScroll
            hasMore={hasNextPage}
            isLoading={isFetching}
            next={fetchNextPage}
            threshold={0.1}
         >
            <TemplateItemsList
               descriptors={prompts}
               collections={collections}
               currentColleciton={currentCollection}
            />
         </InfiniteScroll>
      );
   }

   return (
      <InfiniteScroll
         hasMore={hasNextPage}
         isLoading={isFetching}
         next={fetchNextPage}
         threshold={0.1}
      >
         <TemplateItemsGrid
            descriptors={prompts}
            collections={collections}
            currentColleciton={currentCollection}
         />
      </InfiniteScroll>
   );
};

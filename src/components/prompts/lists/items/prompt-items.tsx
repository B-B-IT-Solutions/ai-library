"use client";

import { useMemo } from "react";
import { flatMap, isEmpty } from "es-toolkit/compat";

import InfiniteScroll from "@/components/shadcn/infinite-scroll";
import { useInfiniteLoadPromptsPage } from "@/data/ts-queries/prompt";
import { resolveSort } from "@/data/ts-queries/utils";
import { DCollectionPreview } from "@/data/types/domain/collection";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { DPromptsFilter } from "@/data/types/domain/prompt";

import { PromptItemsGrid } from "./prompt-items-grid";
import { PromptItemsList } from "./prompt-items-list";
import { PromptItemsSkeleton } from "./prompt-items-skeleton";

type Props = {
   viewMode: DListViewMode;
   groupBy: DListGroupByMode;
   sortBy: DListSortByMode;
   filters: DPromptsFilter;
   currentCollection?: DCollectionPreview;
};

export const PromptItems = ({
   viewMode,
   sortBy,
   filters,
   currentCollection,
}: Props) => {
   const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
      useInfiniteLoadPromptsPage({
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
      return <PromptItemsSkeleton viewMode={viewMode} />;
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
            <PromptItemsList
               descriptors={prompts}
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
         <PromptItemsGrid
            prompts={prompts}
            currentColleciton={currentCollection}
         />
      </InfiniteScroll>
   );
};

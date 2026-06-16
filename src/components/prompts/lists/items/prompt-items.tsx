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

import { PromptsSkeleton } from "./prompt-skeleton";
import { PromtpsEmpty } from "./prompts-empty";
import { PromptsGrid } from "./prompts-grid";
import { PromptsList } from "./prompts-list";

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
      return <PromptsSkeleton viewMode={viewMode} />;
   }

   if (isEmpty(prompts)) {
      return <PromtpsEmpty hasActiveFilters={hasActiveFilters} />;
   }

   if (viewMode === DListViewMode.LIST) {
      return (
         <InfiniteScroll
            hasMore={hasNextPage}
            isLoading={isFetching}
            next={fetchNextPage}
            threshold={0.1}
         >
            <PromptsList
               prompts={prompts}
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
         <PromptsGrid prompts={prompts} currentColleciton={currentCollection} />
      </InfiniteScroll>
   );
};

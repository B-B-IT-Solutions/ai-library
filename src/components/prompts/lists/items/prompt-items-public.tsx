"use client";

import { useMemo } from "react";
import { flatMap, isEmpty } from "es-toolkit/compat";

import InfiniteScroll from "@/components/shadcn/infinite-scroll";
import { useInfiniteLoadPublicTemplateDescriptors } from "@/data/ts-queries/prompt";
import { resolveSort } from "@/data/ts-queries/utils";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { DPromptsFilter } from "@/data/types/domain/prompt";

import { PromptsSkeleton } from "./prompt-skeleton";
import { PromtpsEmpty } from "./prompts-empty";
import { PublicPromptsGrid } from "./prompts-grid-public";

type Props = {
   viewMode: DListViewMode;
   groupBy: DListGroupByMode;
   sortBy: DListSortByMode;
   filters: DPromptsFilter;
   collectionToken?: string | null;
};

export const PublicPromptItems = ({
   viewMode,
   groupBy,
   sortBy,
   filters,
   collectionToken,
}: Props) => {
   const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
      useInfiniteLoadPublicTemplateDescriptors({
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

   return (
      <InfiniteScroll
         hasMore={hasNextPage}
         isLoading={isFetching}
         next={fetchNextPage}
         threshold={0.1}
      >
         <PublicPromptsGrid
            prompts={prompts}
            collectionToken={collectionToken}
         />
      </InfiniteScroll>
   );
};

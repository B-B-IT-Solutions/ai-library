"use client";

import { useMemo } from "react";
import { flatMap } from "es-toolkit/compat";

import InfiniteScroll from "@/components/shadcn/infinite-scroll";
import { useInfiniteLoadPublicTemplateDescriptors } from "@/data/ts-queries/prompt";
import { resolveSort } from "@/data/ts-queries/utils";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { DPromptsFilter } from "@/data/types/domain/prompt";

import { PublicTemplateItemsGrid } from "./prompt-items-grid-public";

type Props = {
   viewMode: DListViewMode;
   groupBy: DListGroupByMode;
   sortBy: DListSortByMode;
   filters: DPromptsFilter;
   collectionToken?: string | null;
};

export const PublicTemplateItems = ({
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

   const entries = useMemo(
      () => flatMap(data?.pages, (page) => page.content),
      [data]
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

   return (
      <InfiniteScroll
         hasMore={hasNextPage}
         isLoading={isFetching}
         next={fetchNextPage}
         threshold={0.7}
      >
         <PublicTemplateItemsGrid
            descriptors={entries}
            collectionToken={collectionToken}
         />
      </InfiniteScroll>
   );
};

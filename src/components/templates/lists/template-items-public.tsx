"use client";

import { useMemo } from "react";
import { flatMap } from "es-toolkit/compat";

import InfiniteScroll from "@/components/shadcn/infinite-scroll";
import { useInfiniteLoadTemplateDescriptors } from "@/data/ts-queries/library";
import { resolveSort } from "@/data/ts-queries/utils";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { DTemplateDescriptorsFilter } from "@/data/types/domain/prompt.template";

import { TemplateItemsGrid } from "./template-items-grid";
import { TemplateItemsList } from "./template-items-list";

type Props = {
   viewMode: DListViewMode;
   groupBy: DListGroupByMode;
   sortBy: DListSortByMode;
   filters: DTemplateDescriptorsFilter;
};

export const TemplateItemsPublic = ({
   viewMode,
   groupBy,
   sortBy,
   filters,
}: Props) => {
   const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
      useInfiniteLoadTemplateDescriptors({
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

   if (viewMode === DListViewMode.LIST) {
      return (
         <InfiniteScroll
            hasMore={hasNextPage}
            isLoading={isFetching}
            next={fetchNextPage}
            threshold={0.7}
         >
            <TemplateItemsList descriptors={entries} collections={[]} />
         </InfiniteScroll>
      );
   }

   return (
      <InfiniteScroll
         hasMore={hasNextPage}
         isLoading={isFetching}
         next={fetchNextPage}
         threshold={0.7}
      >
         <TemplateItemsGrid descriptors={entries} collections={[]} />
      </InfiniteScroll>
   );
};

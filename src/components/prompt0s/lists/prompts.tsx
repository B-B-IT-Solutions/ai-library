"use client";

import { FC, useMemo } from "react";
import { flatMap } from "es-toolkit/compat";

import InfiniteScroll from "@/components/shadcn/infinite-scroll";
import { useInfiniteLoadPrompts } from "@/data/ts-queries/prompt0";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { DPrompt0sFilter } from "@/data/types/domain/prompt0";

import { PromptsGrid } from "./prompts-grid";

type Props = {
   viewMode: DListViewMode;
   groupBy: DListGroupByMode;
   sortBy: DListSortByMode;
   filters: DPrompt0sFilter;
};

export const Prompts: FC<Props> = ({ viewMode, groupBy, sortBy, filters }) => {
   const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
      useInfiniteLoadPrompts({});

   const prompts = useMemo(
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

   // if (viewMode === DListViewMode.LIST) {
   //    return (
   //       <InfiniteScroll
   //          hasMore={hasNextPage ?? false}
   //          isLoading={isFetching}
   //          next={fetchNextPage}
   //          threshold={0.7}
   //       >
   //          <div className="p-6">
   //             <LibraryEntriesList
   //                entries={entries}
   //                collections={collections}
   //             />
   //          </div>
   //       </InfiniteScroll>
   //    );
   // }

   return (
      <InfiniteScroll
         hasMore={hasNextPage}
         isLoading={isFetching}
         next={fetchNextPage}
         threshold={0.7}
      >
         <div className="p-6">
            <PromptsGrid prompts={prompts} />
         </div>
      </InfiniteScroll>
   );
};

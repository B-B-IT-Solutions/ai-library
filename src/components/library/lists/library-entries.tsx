"use client";

import { useMemo } from "react";
import { flatMap } from "es-toolkit/compat";

import InfiniteScroll from "@/components/shadcn/infinite-scroll";
import {
   useInfiniteLoadLibraryEntries,
   useLoadLibraryCollections,
} from "@/data/ts-queries/library";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { DLibraryEntriesFilter } from "@/data/types/domain/library";

import { LibraryEntriesGrid } from "./library-entries-grid";
import { LibraryEntriesGrouped } from "./library-entries-grouped";
import { LibraryEntriesList } from "./library-entries-list";

type Props = {
   viewMode: DListViewMode;
   groupBy: DListGroupByMode;
   sortBy: DListSortByMode;
   filters: DLibraryEntriesFilter;
};

export const LibraryEntries = ({
   viewMode,
   groupBy,
   sortBy,
   filters,
}: Props) => {
   const { data: collections = [] } = useLoadLibraryCollections();
   const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
      useInfiniteLoadLibraryEntries({
         filters,
         sortBy,
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

   if (groupBy !== DListGroupByMode.NONE) {
      return (
         <LibraryEntriesGrouped
            entries={entries}
            groupBy={groupBy}
            collections={collections}
         />
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
            <LibraryEntriesList entries={entries} collections={collections} />
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
         <LibraryEntriesGrid entries={entries} collections={collections} />
      </InfiniteScroll>
   );
};

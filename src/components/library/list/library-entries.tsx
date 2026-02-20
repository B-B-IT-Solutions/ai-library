"use client";

import { FC, useMemo } from "react";
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
import { useLibraryFilters } from "../filters/library-filters-context";

import { LibraryEntriesGrid } from "./library-entries-grid";
import { LibraryEntriesGrouped } from "./library-entries-grouped";
import { LibraryEntriesList } from "./library-entries-list";

type Props = {
   viewMode: DListViewMode;
   groupBy: DListGroupByMode;
   sortBy: DListSortByMode;
};

export const LibraryEntries: FC<Props> = ({ viewMode, groupBy, sortBy }) => {
   const context = useLibraryFilters();
   const { data: collections = [] } = useLoadLibraryCollections();
   const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
      useInfiniteLoadLibraryEntries({
         search: context.filters.search,
         categories: context.filters.categories,
         models: context.filters.models,
         isFavorite: context.filters.isFavorite,
         collectionIds: context.filters.collectionIds,
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

   if (groupBy !== "none") {
      return (
         <div className="p-6">
            <LibraryEntriesGrouped
               entries={entries}
               groupBy={groupBy}
               collections={collections}
            />
         </div>
      );
   }

   if (viewMode === "list") {
      return (
         <InfiniteScroll
            hasMore={hasNextPage ?? false}
            isLoading={isFetching}
            next={fetchNextPage}
            threshold={0.7}
         >
            <div className="p-6">
               <LibraryEntriesList
                  entries={entries}
                  collections={collections}
               />
            </div>
         </InfiniteScroll>
      );
   }

   return (
      <InfiniteScroll
         hasMore={hasNextPage ?? false}
         isLoading={isFetching}
         next={fetchNextPage}
         threshold={0.7}
      >
         <div className="p-6">
            <LibraryEntriesGrid entries={entries} collections={collections} />
         </div>
      </InfiniteScroll>
   );
};

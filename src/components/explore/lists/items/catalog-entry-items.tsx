"use client";

import { useMemo } from "react";
import { flatMap, isEmpty } from "es-toolkit/compat";

import InfiniteScroll from "@/components/shadcn/infinite-scroll";
import { useInfiniteLoadCatalogEntryDescriptors } from "@/data/ts-queries/catalog";
import { resolveSort } from "@/data/ts-queries/utils";
import { DCatalogEntriesFilter } from "@/data/types/domain/catalog";
import { DListSortByMode, DListViewMode } from "@/data/types/domain/common";

import { CatalogEntriesEmpty } from "./catalog-entries-empty";
import { CatalogEntriesGrid } from "./catalog-entries-grid";
import { CatalogEntriesList } from "./catalog-entries-list";

type Props = {
   viewMode: DListViewMode;
   sortBy: DListSortByMode;
   filters: DCatalogEntriesFilter;
   authenticated: boolean;
};

export const CatalogEntryItems = ({
   viewMode,
   sortBy,
   filters,
   authenticated,
}: Props) => {
   const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
      useInfiniteLoadCatalogEntryDescriptors({
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

   if (isEmpty(entries)) {
      return <CatalogEntriesEmpty />;
   }

   if (viewMode === DListViewMode.LIST) {
      return (
         <InfiniteScroll
            hasMore={hasNextPage}
            isLoading={isFetching}
            next={fetchNextPage}
            threshold={0.1}
         >
            <CatalogEntriesList
               entries={entries}
               authenticated={authenticated}
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
         <CatalogEntriesGrid entries={entries} authenticated={authenticated} />
      </InfiniteScroll>
   );
};

"use client";

import { isEmpty } from "es-toolkit/compat";
import { Folder } from "lucide-react";

import InfiniteScroll from "@/components/shadcn/infinite-scroll";
import { useInfiniteLoadCollectionsPage } from "@/data/ts-queries/collection";
import { resolveSort } from "@/data/ts-queries/utils";
import { DCollectionsFilter } from "@/data/types/domain/collection";
import {
   DCollectionsSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { CreateCollectionButton } from "../buttons";

import { CollectionItemsGrid } from "./collection-items-grid";
import { CollectionItemsList } from "./collection-items-list";

type Props = {
   viewMode: DListViewMode;
   sortMode: DCollectionsSortByMode;
   filters: DCollectionsFilter;
};

export const CollectionItems = ({ viewMode, sortMode, filters }: Props) => {
   const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
      useInfiniteLoadCollectionsPage({
         filters,
         sort: resolveSort(sortMode),
      });

   const collections = data?.pages.flatMap((page) => page.content) ?? [];

   if (isLoading) {
      return (
         <div className="flex items-center justify-center py-16">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
               {[1, 2, 3, 4].map((i) => (
                  <div
                     key={i}
                     className="h-40 animate-pulse rounded-xl border bg-white"
                  />
               ))}
            </div>
         </div>
      );
   }

   if (isEmpty(collections)) {
      return (
         <div
            className="flex flex-col items-center justify-center py-24 text-center"
            data-testid="collection-items-empty"
         >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
               <Folder className="h-8 w-8 text-slate-400" />
            </div>
            <h2 className="mb-2 text-lg font-semibold text-slate-700">
               Noch keine Sammlungen
            </h2>
            <p className="mb-6 max-w-sm text-sm text-slate-500">
               Erstellen Sie Ihre erste Sammlung, um Vorlagen zu gruppieren und
               besser zu organisieren.
            </p>
            <CreateCollectionButton />
         </div>
      );
   }

   const items = () => {
      if (viewMode === DListViewMode.LIST) {
         return (
            <InfiniteScroll
               hasMore={hasNextPage}
               isLoading={isFetching}
               next={fetchNextPage}
               threshold={0.1}
            >
               <CollectionItemsList collections={collections} />
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
            <CollectionItemsGrid collections={collections} />
         </InfiniteScroll>
      );
   };

   return <div data-testid="collection-items">{items()}</div>;
};

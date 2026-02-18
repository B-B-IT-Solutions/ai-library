"use client";

import { flatMap } from "es-toolkit/compat";
import { FC, useMemo } from "react";

import { useInfiniteLoadLibraryEntries } from "@/data/ts-queries/library";
import InfiniteScroll from "@/components/shadcn/infinite-scroll";

import { useLibraryFilters } from "../filters/library-filters-context";
import { LibraryEntriesGrid } from "./library-entries-grid";
import { LibraryEntriesGrouped } from "./library-entries-grouped";
import { LibraryEntriesList } from "./library-entries-list";

export const LibraryContent: FC = () => {
   const context = useLibraryFilters();
   const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isLoading,
   } = useInfiniteLoadLibraryEntries({
      search: context.filters.search,
      categories: context.filters.categories,
      models: context.filters.models,
      isFavorite: context.filters.isFavorite,
      collectionIds: context.filters.collectionIds,
   });

   const entries = useMemo(() => flatMap(data?.pages, (page) => page.content), [data]);

   if (isLoading) {
      return (
         <div className="flex items-center justify-center py-16">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
               <p className="mt-4 text-sm text-slate-600">Lädt Vorlagen...</p>
            </div>
         </div>
      );
   }

   // Grouped view
   if (context.groupBy !== "none") {
      return (
         <div className="p-6">
            <LibraryEntriesGrouped entries={entries} groupBy={context.groupBy} />
         </div>
      );
   }

   // List view
   if (context.viewMode === "list") {
      return (
         <InfiniteScroll
            hasMore={hasNextPage ?? false}
            isLoading={isFetching}
            next={fetchNextPage}
            threshold={0.7}
         >
            <div className="p-6">
               <LibraryEntriesList entries={entries} />
            </div>
         </InfiniteScroll>
      );
   }

   // Grid view (default)
   return (
      <InfiniteScroll
         hasMore={hasNextPage ?? false}
         isLoading={isFetching}
         next={fetchNextPage}
         threshold={0.7}
      >
         <div className="p-6">
            <LibraryEntriesGrid entries={entries} />
         </div>
      </InfiniteScroll>
   );
};

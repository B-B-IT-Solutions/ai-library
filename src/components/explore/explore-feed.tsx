"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryState } from "nuqs";

import InfiniteScroll from "@/components/shadcn/infinite-scroll";
import { getPublishedCatalogEntriesPage } from "@/data/actions/catalog";
import {
   DCatalogEntriesPage,
   DCatalogEntryCategory,
   DCatalogEntrySummary,
} from "@/data/types/domain/catalog";
import { DListViewMode } from "@/data/types/domain/common";

import { CatalogEntryItems, ExploreFilterBar } from "./lists";

type Props = {
   initialEntries: DCatalogEntriesPage;
   categories: DCatalogEntryCategory[];
};

export const ExploreFeed = ({ initialEntries, categories }: Props) => {
   // Read current filter values from URL (ExploreFilterBar manages writing)

   const [entries, setEntries] = useState<DCatalogEntrySummary[]>(
      initialEntries.content
   );
   const [totalElements, setTotalElements] = useState(
      initialEntries.totalElements
   );
   const [hasMore, setHasMore] = useState(
      initialEntries.pageNumber < initialEntries.totalPages - 1
   );
   const [isLoading, setIsLoading] = useState(false);

   const nextPageRef = useRef(initialEntries.pageNumber + 1);

   // When the server sends fresh initialEntries (filter changed → server re-render),
   // reset all client-side scroll state to the first page.
   useEffect(() => {
      setEntries(initialEntries.content);
      setTotalElements(initialEntries.totalElements);
      setHasMore(initialEntries.pageNumber < initialEntries.totalPages - 1);
      nextPageRef.current = initialEntries.pageNumber + 1;
   }, [initialEntries]);

   const loadMore = useCallback(async () => {
      if (isLoading || !hasMore) return;

      setIsLoading(true);
      try {
         const result = await getPublishedCatalogEntriesPage({
            pagination: { pageNumber: nextPageRef.current, pageSize: 12 },
         });

         setEntries((prev) => [...prev, ...result.content]);
         setHasMore(result.pageNumber < result.totalPages - 1);
         nextPageRef.current = result.pageNumber + 1;
      } finally {
         setIsLoading(false);
      }
   }, [isLoading, hasMore]);

   return (
      <div className="space-y-6" data-testid="explore-feed">
         <ExploreFilterBar
            categories={categories}
            totalElements={totalElements}
         />

         <InfiniteScroll
            hasMore={hasMore}
            isLoading={isLoading}
            next={loadMore}
            threshold={0.7}
         >
            {/* <CatalogEntryItems viewMode={DListViewMode.GRID} /> */}
         </InfiniteScroll>
      </div>
   );
};

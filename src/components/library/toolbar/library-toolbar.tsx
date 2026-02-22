"use client";

import { FC, useMemo } from "react";

import { ListViewToggle } from "@/components/shared/buttons";
import { useInfiniteLoadLibraryEntries } from "@/data/ts-queries/library";
import { DListViewMode } from "@/data/types/domain/common";
import { DLibraryEntriesFilter } from "@/data/types/domain/library";
import { LibraryFilters } from "../filters/library-filters";

import { GroupBySelect } from "./group-by-select";
import { SortBySelect } from "./sort-by-select";

type Props = {
   viewMode: DListViewMode;
   filters: DLibraryEntriesFilter;
};

export const LibraryToolbar: FC<Props> = ({ viewMode, filters }) => {
   const { data } = useInfiniteLoadLibraryEntries({
      search: filters.search,
      categories: filters.categories,
      models: filters.models,
      isFavorite: filters.isFavorite,
      collectionIds: filters.collectionIds,
   });

   const totalEntries = useMemo(() => {
      if (!data?.pages) return 0;
      const firstPage = data.pages[0];
      return firstPage?.totalEntries || 0;
   }, [data]);

   return (
      <div
         className="flex items-center justify-between border-b bg-white px-6 py-3"
         data-testid="library-toolbar"
      >
         <div className="flex items-center gap-4">
            <ListViewToggle currentView={viewMode} />
            <LibraryFilters />
            <GroupBySelect />
            <SortBySelect />
         </div>

         <span className="text-sm text-slate-600">
            {totalEntries} {totalEntries === 1 ? "Vorlage" : "Vorlagen"}
         </span>
      </div>
   );
};

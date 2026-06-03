"use client";

import { FC, useMemo } from "react";

import { ListViewToggle } from "@/components/shared/buttons";
import { useInfiniteLoadTemplateDescriptors } from "@/data/ts-queries/prompt";
import { resolveSort } from "@/data/ts-queries/utils";
import {
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { DPromptsFilter } from "@/data/types/domain/prompt";

import { LibraryFilters } from "./filters";
import { SortBySelect } from "./sort-by";

type Props = {
   viewMode: DListViewMode;
   sortBy?: DListSortByMode;
   filters: DPromptsFilter;
   categories: string[];
   models: string[];
};

export const TemplatesToolbar: FC<Props> = ({
   viewMode,
   sortBy,
   filters,
   categories,
   models,
}) => {
   const { data } = useInfiniteLoadTemplateDescriptors({
      filters,
      sort: resolveSort(sortBy),
   });

   const totalEntries = useMemo(() => {
      return data?.pages?.[0]?.totalElements ?? 0;
   }, [data]);

   return (
      <div
         className="flex items-center justify-between border-b bg-white px-6 py-3"
         data-testid="templates-toolbar"
      >
         <div className="flex items-center gap-4">
            <ListViewToggle currentView={viewMode} />
            <LibraryFilters categories={categories} models={models} />
            <SortBySelect />
         </div>

         <span className="text-sm text-slate-600">
            {totalEntries} {totalEntries === 1 ? "Vorlage" : "Vorlagen"}
         </span>
      </div>
   );
};

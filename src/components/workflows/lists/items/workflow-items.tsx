"use client";

import { useMemo } from "react";
import { flatMap, isEmpty } from "es-toolkit/compat";
import { GitBranch, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import InfiniteScroll from "@/components/shadcn/infinite-scroll";
import { resolveSort } from "@/data/ts-queries/utils";
import {
   type LoadWorkflowsPageParams,
   useInfiniteLoadWorkflowsPage,
} from "@/data/ts-queries/workflow";
import {
   DListViewMode,
   DWorkflowsSortByMode,
} from "@/data/types/domain/common";
import { DWorkflowsFilter } from "@/data/types/domain/workflow";

import { WorkflowsGrid } from "./workflows-grid";
import { WorfklowsList } from "./workflows-list";
import { WorkflowsSkeleton } from "./workflows-skeleton";

type Props = {
   viewMode: DListViewMode;
   filters: DWorkflowsFilter;
   sortMode: DWorkflowsSortByMode;
};

export const WorkflowItems = ({ viewMode, filters, sortMode }: Props) => {
   const params: LoadWorkflowsPageParams = {
      filters,
      sort: resolveSort(sortMode),
   };

   const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
      useInfiniteLoadWorkflowsPage(params);

   const workflows = useMemo(
      () => flatMap(data?.pages, (page) => page.content),
      [data]
   );

   const hasActiveFilters = useMemo(() => !isEmpty(filters.search), [filters]);

   if (isLoading) {
      return <WorkflowsSkeleton viewMode={viewMode} />;
   }

   if (isEmpty(workflows)) {
      if (hasActiveFilters) {
         return (
            <div
               className="flex flex-col items-center justify-center py-16 text-center"
               data-testid="workflows-filter-empty"
            >
               <p className="text-lg font-medium text-slate-700">
                  Keine Ergebnisse für diese Filter
               </p>
               <p className="mt-2 text-sm text-slate-500">
                  Passe deine Filterkriterien an oder setze sie zurück.
               </p>
            </div>
         );
      }
      return <EmptyState />;
   }

   if (viewMode === DListViewMode.LIST) {
      return (
         <InfiniteScroll
            hasMore={hasNextPage}
            isLoading={isFetching}
            next={fetchNextPage}
            threshold={0.1}
         >
            <WorfklowsList workflows={workflows} />
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
         <WorkflowsGrid workflows={workflows} />
      </InfiniteScroll>
   );
};

const EmptyState = () => (
   <div
      className="flex flex-col items-center justify-center gap-4 py-16 text-center"
      data-testid="workflows-empty"
   >
      <GitBranch className="h-12 w-12 text-slate-300" />
      <h2 className="text-lg font-semibold text-slate-700">
         Noch keine Workflows
      </h2>
      <p className="max-w-sm text-sm text-muted-foreground">
         Verbinde mehrere Prompts zu einem geführten Prozess.
      </p>
      <Button asChild>
         <Link href="/workflows/new">
            <Plus className="mr-2 h-4 w-4" />
            Ersten Workflow erstellen
         </Link>
      </Button>
   </div>
);

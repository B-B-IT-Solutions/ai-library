"use client";

import { useMemo } from "react";
import { flatMap, isEmpty } from "es-toolkit/compat";

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

import { WorkflowsEmpty } from "./workflows-empty";
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
      return <WorkflowsEmpty hasActiveFilters={hasActiveFilters} />;
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

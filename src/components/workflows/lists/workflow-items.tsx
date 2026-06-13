"use client";

import { useMemo } from "react";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { flatMap } from "es-toolkit/compat";
import { GitBranch, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import InfiniteScroll from "@/components/shadcn/infinite-scroll";
import {
   type LoadWorkflowsPageParams,
   useInfiniteLoadWorkflowsPage,
   workflowKeys,
} from "@/data/ts-queries/workflow";
import { DWorkflowsPage } from "@/data/types/domain/workflow";

import { WorkflowItem } from "./items";

type Props = {
   params: LoadWorkflowsPageParams;
};

export const WorkflowItems = ({ params }: Props) => {
   const queryClient = useQueryClient();

   const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
      useInfiniteLoadWorkflowsPage(params);

   const workflows = useMemo(
      () => flatMap(data?.pages, (page) => page.content),
      [data]
   );

   const handleDeleted = (workflowId: string) => {
      queryClient.setQueryData<InfiniteData<DWorkflowsPage>>(
         workflowKeys.workflows(params),
         (old) => {
            if (!old) return old;
            return {
               ...old,
               pages: old.pages.map((page) => ({
                  ...page,
                  content: page.content.filter((w) => w.id !== workflowId),
               })),
            };
         }
      );
   };

   if (isLoading) {
      return <WorkflowsListSkeleton />;
   }

   if (workflows.length === 0) {
      return <EmptyState />;
   }

   return (
      <InfiniteScroll
         hasMore={hasNextPage}
         isLoading={isFetching}
         next={fetchNextPage}
         threshold={0.1}
      >
         <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            data-testid="workflow-items"
         >
            {workflows.map((workflow) => (
               <WorkflowItem
                  key={workflow.id}
                  workflow={workflow}
                  onDeleted={() => handleDeleted(workflow.id)}
               />
            ))}
         </div>
      </InfiniteScroll>
   );
};

const WorkflowsListSkeleton = () => (
   <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      data-testid="workflows-list-skeleton"
   >
      {Array.from({ length: 6 }).map((_, i) => (
         <div key={i} className="h-40 animate-pulse rounded-lg bg-slate-200" />
      ))}
   </div>
);

const EmptyState = () => (
   <div
      className="flex flex-col items-center justify-center gap-4 py-16 text-center"
      data-testid="workflows-empty-state"
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

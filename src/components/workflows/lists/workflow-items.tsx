"use client";

import { useState } from "react";
import { GitBranch, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { DWorkflow, DWorkflowsUsage } from "@/data/types/domain/workflow";

import { WorkflowItem } from "./items";

type Props = {
   workflows: DWorkflow[];
   usage: DWorkflowsUsage;
};

export const WorkflowItems = ({
   workflows: initialWorkflows,
   usage,
}: Props) => {
   const [workflows, setWorkflows] = useState<DWorkflow[]>(initialWorkflows);

   const handleDeleted = (workflowId: string) => {
      setWorkflows((prev) => prev.filter((w) => w.id !== workflowId));
   };

   const isFreeTier = usage.limit === 0;

   return (
      <div className="flex h-full flex-col bg-slate-50">
         {/* Grid or empty state */}
         <div className="flex-1 overflow-y-auto p-6">
            {workflows.length === 0 ? (
               <EmptyState isFreeTier={isFreeTier} />
            ) : (
               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {workflows.map((workflow) => (
                     <WorkflowItem
                        key={workflow.id}
                        workflow={workflow}
                        onDeleted={() => handleDeleted(workflow.id)}
                     />
                  ))}
               </div>
            )}
         </div>
      </div>
   );
};

const EmptyState = ({ isFreeTier }: { isFreeTier: boolean }) => (
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
      {!isFreeTier && (
         <Button asChild>
            <Link href="/workflows/new">
               <Plus className="mr-2 h-4 w-4" />
               Ersten Workflow erstellen
            </Link>
         </Button>
      )}
   </div>
);

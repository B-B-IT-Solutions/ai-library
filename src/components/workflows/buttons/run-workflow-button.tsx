"use client";

import { useState, useTransition } from "react";
import { Loader2, Play } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { getWorkflowForRunner } from "@/data/actions/workflow";
import { DWorkflow, DWorkflowWithSteps } from "@/data/types/domain/workflow";
import { cn } from "@/lib/utils";
import { WorkflowRunnerDialog } from "../dialogs/workflow-runner-dialog";

type Props = {
   workflow: DWorkflow;
   className?: string;
};

export const RunWorkflowButton = ({ workflow, className }: Props) => {
   const [workflowWithSteps, setWorkflowWithSteps] =
      useState<DWorkflowWithSteps | null>(null);
   const [isPending, startTransition] = useTransition();

   const handleClick = () => {
      startTransition(async () => {
         const data = await getWorkflowForRunner(workflow.id);
         if (data) {
            setWorkflowWithSteps(data);
         } else {
            toast.error("Workflow konnte nicht geladen werden.");
         }
      });
   };

   const dialog = () => {
      if (workflowWithSteps) {
         return (
            <WorkflowRunnerDialog
               workflow={workflowWithSteps}
               onClose={() => setWorkflowWithSteps(null)}
            />
         );
      }
   };

   return (
      <>
         <Button
            variant="default"
            size="sm"
            className={cn(
               "cursor-pointer bg-blue-700 text-white hover:bg-blue-800",
               className
            )}
            onClick={handleClick}
            disabled={isPending}
            data-testid="run-workflow-btn"
         >
            {isPending ? (
               <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
               <Play className="mr-1 h-4 w-4" />
            )}
            Anwenden
         </Button>
         {dialog()}
      </>
   );
};

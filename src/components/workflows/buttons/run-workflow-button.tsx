"use client";

import { useState, useTransition } from "react";
import { Loader2, Play } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { WorkflowRunnerDialog } from "@/components/workflows/runner/workflow-runner-dialog";
import { getWorkflowForRunner } from "@/data/actions/workflow";
import { DWorkflowWithSteps } from "@/data/types/domain/workflow";

type Props = {
   workflowId: string;
   variant?: React.ComponentProps<typeof Button>["variant"];
   size?: React.ComponentProps<typeof Button>["size"];
   className?: string;
};

export const RunWorkflowButton = ({
   workflowId,
   variant,
   size,
   className,
}: Props) => {
   const [workflow, setWorkflow] = useState<DWorkflowWithSteps | null>(null);
   const [isPending, startTransition] = useTransition();

   const handleClick = () => {
      startTransition(async () => {
         const data = await getWorkflowForRunner(workflowId);
         if (!data) {
            toast.error("Workflow konnte nicht geladen werden.");
            return;
         }
         setWorkflow(data);
      });
   };

   return (
      <>
         <Button
            variant={variant}
            size={size}
            className={className}
            onClick={handleClick}
            disabled={isPending}
            data-testid="run-workflow-btn"
         >
            {isPending ? (
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
               <Play className="mr-2 h-4 w-4" />
            )}
            Anwenden
         </Button>

         {workflow && (
            <WorkflowRunnerDialog
               workflow={workflow}
               onClose={() => setWorkflow(null)}
            />
         )}
      </>
   );
};

"use client";

import { X } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/shadcn/dialog";
import { DWorkflowWithSteps } from "@/data/types/domain/workflow";
import { WorkflowRunner } from "../runner/workflow-runner";

type Props = {
   workflow: DWorkflowWithSteps;
   onClose: () => void;
};

export const WorkflowRunnerDialog = ({ workflow, onClose }: Props) => {
   return (
      <Dialog open onOpenChange={onClose} data-testid="run-workflow-dialog">
         <DialogContent
            showCloseButton={false}
            className="overflow-hidden p-0 sm:max-w-none"
         >
            <DialogTitle className="sr-only">{workflow.title}</DialogTitle>
            <div className="flex items-center justify-between border-b bg-background px-6 py-3">
               <h1 className="font-semibold text-foreground">
                  {workflow.title}
               </h1>
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  data-testid="runner-close-btn"
               >
                  <X className="mr-1 h-4 w-4" />
               </Button>
            </div>
            <WorkflowRunner workflow={workflow} />
         </DialogContent>
      </Dialog>
   );
};

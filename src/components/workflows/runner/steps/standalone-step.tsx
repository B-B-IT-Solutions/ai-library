"use client";

import { CopyButton } from "@/components/shared/buttons";
import { MDRenderer } from "@/components/shared/md";
import { DWorkflowStep } from "@/data/types/domain/workflow";

type Props = {
   step: DWorkflowStep;
};

export const StandaloneStep = ({ step }: Props) => {
   if (step.content) {
      return (
         <div className="space-y-2" data-testid="standalone-step">
            <div className="flex items-center justify-between">
               <span className="text-sm font-medium text-muted-foreground">
                  Prompt
               </span>
               <CopyButton
                  content={step.content}
                  variant="ghost"
                  size="sm"
                  showLabel
               />
            </div>
            <div className="rounded-xl bg-muted p-5">
               <MDRenderer className="font-mono text-sm leading-relaxed text-foreground">
                  {step.content}
               </MDRenderer>
            </div>
         </div>
      );
   }
};

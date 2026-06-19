"use client";

import { ChevronRight } from "lucide-react";

import { DWorkflowStep } from "@/data/types/domain/workflow";

type Props = {
   historyStack: string[];
   currentIndex: number;
   steps: DWorkflowStep[];
   estimatedTotalSteps: number;
};

export const RunnerBreadcrumb = ({
   historyStack,
   currentIndex,
   steps,
   estimatedTotalSteps,
}: Props) => {
   const stepNumber = currentIndex + 1;
   const progressPercent = Math.min(
      (stepNumber / Math.max(estimatedTotalSteps, stepNumber)) * 100,
      100
   );

   return (
      <div className="border-b bg-muted/50">
         <div className="px-6 pt-2.5 pb-1.5">
            <div className="flex items-center justify-between mb-1.5">
               <span className="text-xs text-muted-foreground">
                  Schritt {stepNumber} von ~{estimatedTotalSteps}
               </span>
            </div>
            <div className="h-1 w-full rounded-full bg-border overflow-hidden">
               <div
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
               />
            </div>
         </div>
         <div className="flex items-center gap-1 overflow-x-auto px-6 py-2 text-sm">
            {historyStack.slice(0, currentIndex + 1).map((stepId, idx) => {
               const step = steps.find((s) => s.edgeId === stepId);
               const isCurrent = idx === currentIndex;
               return (
                  <span
                     key={stepId}
                     className="flex items-center gap-1 shrink-0"
                  >
                     {idx > 0 && (
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                     )}
                     <span
                        className={
                           isCurrent
                              ? "font-semibold text-primary flex items-center gap-1.5"
                              : "text-muted-foreground"
                        }
                     >
                        {isCurrent && (
                           <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        )}
                        {step?.title ?? stepId}
                     </span>
                  </span>
               );
            })}
         </div>
      </div>
   );
};

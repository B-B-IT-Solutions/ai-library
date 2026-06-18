"use client";

import { ChevronRight } from "lucide-react";

import { DWorkflowStep } from "@/data/types/domain/workflow";

type Props = {
   historyStack: string[];
   currentIndex: number;
   steps: DWorkflowStep[];
};

export const RunnerBreadcrumb = ({
   historyStack,
   currentIndex,
   steps,
}: Props) => {
   return (
      <div className="flex items-center gap-1 overflow-x-auto border-b bg-slate-50 px-6 py-2 text-sm">
         {historyStack.slice(0, currentIndex + 1).map((stepId, idx) => {
            const step = steps.find((s) => s.edgeId === stepId);
            const isCurrent = idx === currentIndex;
            return (
               <span key={stepId} className="flex items-center gap-1">
                  {idx > 0 && (
                     <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  )}
                  <span
                     className={
                        isCurrent
                           ? "font-semibold text-primary"
                           : "text-muted-foreground"
                     }
                  >
                     {step?.title ?? stepId}
                  </span>
               </span>
            );
         })}
      </div>
   );
};

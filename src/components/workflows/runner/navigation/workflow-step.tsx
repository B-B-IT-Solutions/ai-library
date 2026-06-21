"use client";

import { find } from "es-toolkit/compat";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { DWorkflowStep, DWorkflowStepEdge } from "@/data/types/domain/workflow";
import { cn } from "@/lib/utils";

type Props = {
   edge: DWorkflowStepEdge;
   allSteps: DWorkflowStep[];
   onSelected: (toStepEdgeId: string) => void;
};

export const NextStep = ({ edge, allSteps, onSelected }: Props) => {
   const target = find(allSteps, (s) => s.edgeId === edge.toStepEdgeId);
   return (
      <Button
         variant="outline"
         onClick={() => onSelected(edge.toStepEdgeId)}
         className="group h-auto cursor-pointer justify-between text-left"
         data-testid="next-step-btn"
      >
         <div>
            <span className="text-sm font-semibold">{edge.label}</span>
            {target && (
               <p
                  className={cn(
                     "mt-0.5 text-xs font-normal text-muted-foreground"
                  )}
               >
                  → {target.title}
               </p>
            )}
         </div>
         <ArrowRight
            className={cn(
               "ml-3 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
            )}
         />
      </Button>
   );
};

"use client";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { DWorkflowStep } from "@/data/types/domain/workflow";

type Props = {
   edges: DWorkflowStep["outgoingEdges"];
   steps: DWorkflowStep[];
   onChoose: (toStepId: string) => void;
};

export const NextStepButtons = ({ edges, steps, onChoose }: Props) => {
   if (edges.length === 0) return null;

   return (
      <div className="space-y-3">
         <p className="text-sm font-medium text-slate-700">
            Wie möchtest du weiter?
         </p>
         <div className="flex flex-wrap gap-3">
            {edges
               .sort((a, b) => a.order - b.order)
               .map((edge) => {
                  const target = steps.find((s) => s.edgeId === edge.toStepId);
                  return (
                     <Button
                        key={edge.id}
                        variant="outline"
                        onClick={() => onChoose(edge.toStepId)}
                        data-testid={`edge-btn-${edge.id}`}
                     >
                        {edge.label}
                        {target && (
                           <Badge variant="secondary" className="ml-2 text-xs">
                              {target.title}
                           </Badge>
                        )}
                     </Button>
                  );
               })}
         </div>
      </div>
   );
};

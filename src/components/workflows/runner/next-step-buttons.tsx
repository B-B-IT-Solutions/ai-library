"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { DWorkflowStep } from "@/data/types/domain/workflow";
import { cn } from "@/lib/utils";

type Props = {
   edges: DWorkflowStep["outgoingEdges"];
   steps: DWorkflowStep[];
   onChoose: (toStepId: string) => void;
   canGoBack: boolean;
   onBack: () => void;
};

export const NextStepButtons = ({
   edges,
   steps,
   onChoose,
   canGoBack,
   onBack,
}: Props) => {
   const sortedEdges = [...edges].sort((a, b) => a.order - b.order);
   const isSingleOption = sortedEdges.length === 1;

   return (
      <div className="flex items-start gap-4">
         <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            disabled={!canGoBack}
            className="shrink-0"
            data-testid="runner-back-btn"
         >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Zurück
         </Button>

         <div className="flex flex-col gap-2">
            {sortedEdges.map((edge) => {
               const target = steps.find((s) => s.edgeId === edge.toStepId);
               return (
                  <Button
                     key={edge.id}
                     variant="outline"
                     onClick={() => onChoose(edge.toStepId)}
                     data-testid={`edge-btn-${edge.id}`}
                     className="group h-auto justify-between px-4 py-3 text-left"
                  >
                     <div>
                        <span className="text-sm font-semibold">
                           {edge.label}
                        </span>
                        {target && (
                           <p
                              className={cn(
                                 "mt-0.5 text-xs font-normal",
                                 isSingleOption
                                    ? "text-primary-foreground/70"
                                    : "text-muted-foreground"
                              )}
                           >
                              → {target.title}
                           </p>
                        )}
                     </div>
                     <ArrowRight
                        className={cn(
                           "ml-3 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5",
                           isSingleOption
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                        )}
                     />
                  </Button>
               );
            })}
         </div>
      </div>
   );
};

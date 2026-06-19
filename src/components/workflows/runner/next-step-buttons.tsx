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
      <div className="flex space-y-3 space-x-3">
         <div className="flex items-center justify-between">
            <Button
               variant="ghost"
               size="sm"
               onClick={onBack}
               disabled={!canGoBack}
               data-testid="runner-back-btn"
            >
               <ArrowLeft className="mr-1 h-4 w-4" />
               Zurück
            </Button>
         </div>

         <div className="flex flex-col gap-2">
            {sortedEdges.map((edge) => {
               const target = steps.find((s) => s.edgeId === edge.toStepId);
               return (
                  <button
                     key={edge.id}
                     onClick={() => onChoose(edge.toStepId)}
                     data-testid={`edge-btn-${edge.id}`}
                     className={cn(
                        "group flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                        isSingleOption
                           ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                           : "border-border bg-background hover:border-primary/50 hover:bg-accent/50"
                     )}
                  >
                     <div>
                        <span className="text-sm font-semibold">
                           {edge.label}
                        </span>
                        {target && (
                           <p
                              className={cn(
                                 "mt-0.5 text-xs",
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
                           "h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5",
                           isSingleOption
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                        )}
                     />
                  </button>
               );
            })}
         </div>
      </div>
   );
};

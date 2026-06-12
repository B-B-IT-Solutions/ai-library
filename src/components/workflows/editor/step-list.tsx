"use client";

import { AlertTriangle, ArrowRight, Edit, MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import {
   DWorkflowWithSteps,
   DWorkflowStep,
} from "@/data/types/domain/workflow";
import { cn } from "@/lib/utils";

type Props = {
   workflow: DWorkflowWithSteps;
   selectedStepId: string | null;
   onSelectStep: (step: DWorkflowStep) => void;
   onSetStartStep: (step: DWorkflowStep) => void;
   onDeleteStep: (step: DWorkflowStep) => void;
};

export const StepList = ({
   workflow,
   selectedStepId,
   onSelectStep,
   onSetStartStep,
   onDeleteStep,
}: Props) => {
   const { steps } = workflow;

   const hasStart = steps.some((s) => s.isStart);

   return (
      <div className="space-y-2" data-testid="step-list">
         {!hasStart && steps.length > 0 && (
            <div className="flex items-center gap-2 rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
               <AlertTriangle className="h-4 w-4 shrink-0" />
               Kein Startschritt gesetzt
            </div>
         )}

         {steps.map((step) => {
            const isSelected = step.id === selectedStepId;
            const isEndStep = step.outgoingEdges.length === 0;
            const incomingCount = steps.filter((s) =>
               s.outgoingEdges.some((e) => e.toStepId === step.id)
            ).length;
            const isDisconnected = !step.isStart && incomingCount === 0;

            return (
               <div
                  key={step.id}
                  className={cn(
                     "cursor-pointer rounded-lg border bg-white p-3 transition-colors hover:border-primary",
                     isSelected && "border-primary ring-1 ring-primary"
                  )}
                  onClick={() => onSelectStep(step)}
                  data-testid={`step-card-${step.id}`}
               >
                  <div className="flex items-start justify-between gap-2">
                     <div className="flex min-w-0 flex-1 items-center gap-2">
                        {step.isStart && (
                           <Badge className="shrink-0 bg-blue-600 text-xs hover:bg-blue-600">
                              Start
                           </Badge>
                        )}
                        {isEndStep && !step.isStart && (
                           <Badge
                              variant="secondary"
                              className="shrink-0 text-xs"
                           >
                              Ende
                           </Badge>
                        )}
                        {isDisconnected && (
                           <Badge
                              variant="outline"
                              className="shrink-0 border-yellow-400 text-xs text-yellow-700"
                           >
                              Nicht verbunden
                           </Badge>
                        )}
                        <span className="truncate text-sm font-medium">
                           {step.title}
                        </span>
                     </div>

                     <div className="flex items-center gap-1">
                        <Button
                           variant="ghost"
                           size="icon"
                           className="h-6 w-6"
                           onClick={(e) => {
                              e.stopPropagation();
                              onSelectStep(step);
                           }}
                        >
                           <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                              <Button
                                 variant="ghost"
                                 size="icon"
                                 className="h-6 w-6"
                                 onClick={(e) => e.stopPropagation()}
                              >
                                 <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    onSetStartStep(step);
                                 }}
                                 disabled={step.isStart}
                              >
                                 Als Startschritt setzen
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                 className="text-destructive focus:text-destructive"
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteStep(step);
                                 }}
                              >
                                 Schritt löschen
                              </DropdownMenuItem>
                           </DropdownMenuContent>
                        </DropdownMenu>
                     </div>
                  </div>

                  <div className="mt-1.5 text-xs text-muted-foreground">
                     <Badge variant="outline" className="text-xs">
                        {step.type === "PROMPT_REF"
                           ? "Template"
                           : "Eigenständig"}
                     </Badge>
                     {step.promptTitle && (
                        <span className="ml-2">{step.promptTitle}</span>
                     )}
                  </div>

                  {step.outgoingEdges.length > 0 && (
                     <div className="mt-2 space-y-1">
                        {step.outgoingEdges.map((edge) => {
                           const target = steps.find(
                              (s) => s.id === edge.toStepId
                           );
                           return (
                              <div
                                 key={edge.id}
                                 className="flex items-center gap-1 text-xs text-muted-foreground"
                              >
                                 <ArrowRight className="h-3 w-3 shrink-0" />
                                 <span className="font-medium">
                                    {edge.label}
                                 </span>
                                 <span>→</span>
                                 <span className="truncate">
                                    {target?.title ?? "Unbekannt"}
                                 </span>
                              </div>
                           );
                        })}
                     </div>
                  )}
               </div>
            );
         })}
      </div>
   );
};

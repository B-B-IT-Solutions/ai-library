"use client";

import { filter, find, map } from "es-toolkit/compat";
import { ArrowRight, MoreVertical } from "lucide-react";
import { Control, useWatch } from "react-hook-form";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import {
   DWorkflowStepUpdate,
   DWorkflowUpdate,
} from "@/data/types/domain/workflow";
import { cn } from "@/lib/utils";

type Props = {
   steps: DWorkflowStepUpdate[];
   index: number;
   isSelected: boolean;
   onSelectStep: (index: number) => void;
   onDeleteStep: (index: number) => void;
   control: Control<DWorkflowUpdate>;
};

export const StepItem = ({
   steps,
   index,
   isSelected,
   onSelectStep,
   onDeleteStep,
   control,
}: Props) => {
   const step = useWatch({
      name: `steps.${index}`,
      control,
   });

   const isEndStep = step.edges.length === 0;
   const incomingEdges = filter(steps, (s) =>
      s.edges.some((e) => e.toStepEdgeId === step.edgeId)
   );

   const isDisconnected = !step.isStart && incomingEdges.length === 0;

   return (
      <div
         key={index}
         className={cn(
            "cursor-pointer rounded-lg border bg-white p-3 transition-colors hover:border-primary",
            isSelected && "border-primary ring-1 ring-primary",
            isDisconnected &&
               !isSelected &&
               "border-l-[3px] border-l-orange-400"
         )}
         onClick={() => onSelectStep(index)}
         data-testid="step"
      >
         <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2">
               <span className="w-5 shrink-0 text-right font-mono text-xs text-muted-foreground">
                  {index + 1}.
               </span>
               {step.isStart && (
                  <Badge
                     className="shrink-0 bg-blue-600 text-xs hover:bg-blue-600"
                     data-testid="start-badge"
                  >
                     Start
                  </Badge>
               )}
               {isEndStep && !step.isStart && (
                  <Badge
                     variant="secondary"
                     className="shrink-0 text-xs"
                     data-testid="end-badge"
                  >
                     Ende
                  </Badge>
               )}
               <span className="truncate text-sm font-medium">
                  {step.title}
               </span>
            </div>

            <div className="flex items-center">
               <DropdownMenu>
                  <DropdownMenuTrigger asChild={true}>
                     <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => e.stopPropagation()}
                        data-testid="more-options-btn"
                     >
                        <MoreVertical className="h-3.5 w-3.5" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={(e) => {
                           e.stopPropagation();
                           onDeleteStep(index);
                        }}
                        data-testid="delete-menu-item"
                     >
                        Schritt löschen
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </div>

         <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <Badge
               variant="outline"
               className="text-xs"
               data-testid="type-badge"
            >
               {step.type === "PROMPT_REF" ? "Prompt" : "Eigenständig"}
            </Badge>
            {/* {step.promptTitle && (
               <span className="truncate">{step.promptTitle}</span>
            )} */}
            {isDisconnected && (
               <span className="font-medium text-orange-600">
                  · Nicht verbunden
               </span>
            )}
         </div>

         {step.edges.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
               {map(step.edges, (edge, idx) => {
                  const target = find(
                     steps,
                     (s) => s.edgeId === edge.toStepEdgeId
                  );
                  return (
                     <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                     >
                        {edge.label}
                        <ArrowRight className="h-3 w-3 shrink-0" />
                        <span className="max-w-20 truncate">
                           {target?.title ?? "?"}
                        </span>
                     </span>
                  );
               })}
            </div>
         )}
      </div>
   );
};

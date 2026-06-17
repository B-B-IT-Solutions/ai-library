"use client";

import { filter, find } from "es-toolkit/compat";
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
   const incomingCount = filter(steps, (s) =>
      s.edges.some((e) => e.toStepId === step.edgeId)
   ).length;

   const isDisconnected = !step.isStart && incomingCount === 0;

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
         data-testid={`step-card-${index}`}
      >
         <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2">
               <span className="w-5 shrink-0 text-right font-mono text-xs text-muted-foreground">
                  {index + 1}.
               </span>
               {step.isStart && (
                  <Badge className="shrink-0 bg-blue-600 text-xs hover:bg-blue-600">
                     Start
                  </Badge>
               )}
               {isEndStep && !step.isStart && (
                  <Badge variant="secondary" className="shrink-0 text-xs">
                     Ende
                  </Badge>
               )}
               <span className="truncate text-sm font-medium">
                  {step.title}
               </span>
            </div>

            <div className="flex items-center">
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => e.stopPropagation()}
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
                     >
                        Schritt löschen
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </div>

         <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs">
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
               {step.edges.map((edge) => {
                  const target = find(steps, (s) => s.edgeId === edge.toStepId);
                  return (
                     <span
                        key={edge.toStepId}
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

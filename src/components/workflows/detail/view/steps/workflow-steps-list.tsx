import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Separator } from "@/components/shadcn/separator";
import {
   DWorkflowStep,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";

type Props = {
   workflow: DWorkflowWithSteps;
};

export const WorkflowStepsList = ({ workflow }: Props) => {
   if (workflow.steps.length === 0) {
      return (
         <div
            className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm"
            data-testid="steps-empty"
         >
            Dieser Workflow hat noch keine Schritte.
         </div>
      );
   }

   return (
      <div className="space-y-3" data-testid="workflow-steps-list">
         {workflow.steps.map((step, index) => (
            <StepCard
               key={step.id}
               step={step}
               index={index}
               allSteps={workflow.steps}
            />
         ))}
      </div>
   );
};

type StepCardProps = {
   step: DWorkflowStep;
   index: number;
   allSteps: DWorkflowStep[];
};

const StepCard = ({ step, index, allSteps }: StepCardProps) => {
   const isEnd = step.outgoingEdges.length === 0;

   return (
      <div
         className="rounded-xl bg-white p-5 shadow-sm"
         data-testid="step-card"
      >
         <div className="flex items-start gap-4">
            <span className="mt-0.5 w-5 shrink-0 text-right font-mono text-xs text-slate-400">
               {index + 1}.
            </span>
            <div className="min-w-0 flex-1 space-y-3">
               <div className="flex flex-wrap items-center gap-2">
                  {step.isStart && (
                     <Badge className="bg-blue-600 text-xs hover:bg-blue-600">
                        Start
                     </Badge>
                  )}
                  {isEnd && !step.isStart && (
                     <Badge variant="secondary" className="text-xs">
                        Ende
                     </Badge>
                  )}
                  <span className="font-medium text-slate-900">
                     {step.title}
                  </span>
               </div>

               <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                     {step.type === "PROMPT_REF" ? "Prompt" : "Eigenständig"}
                  </Badge>
                  {step.type === "PROMPT_REF" && step.promptTitle && (
                     <span className="truncate text-xs text-slate-500">
                        {step.promptTitle}
                     </span>
                  )}
               </div>

               {step.hint && (
                  <>
                     <Separator />
                     <p className="text-sm text-slate-600">{step.hint}</p>
                  </>
               )}

               {step.outgoingEdges.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                     {step.outgoingEdges
                        .slice()
                        .sort((a, b) => a.order - b.order)
                        .map((edge, idx) => {
                           const target = allSteps.find(
                              (s) => s.edgeId === edge.toStepId
                           );
                           return (
                              <span
                                 key={idx}
                                 className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                              >
                                 {edge.label}
                                 <ArrowRight className="h-3 w-3 shrink-0" />
                                 <span className="max-w-24 truncate">
                                    {target?.title ?? "?"}
                                 </span>
                              </span>
                           );
                        })}
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

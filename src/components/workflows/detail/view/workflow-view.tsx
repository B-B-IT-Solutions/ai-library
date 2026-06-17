import { format } from "date-fns";
import { ArrowRight, CalendarDays, Layers } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";
import {
   ItemDetailsView,
   ItemDetailsViewBody,
   ItemDetailsViewContent,
   ItemDetailsViewHeader,
} from "@/components/shared/wrappers/item-details";
import {
   DWorkflowStep,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";
import { WorkflowBreadcrumb } from "../../breadcrumbs";

type Props = {
   workflow: DWorkflowWithSteps;
};

export const WorkflowView = ({ workflow }: Props) => {
   return (
      <ItemDetailsView data-testid="workflow-view">
         <ItemDetailsViewHeader>
            <div className="flex items-center" data-testid="workflow-view-header">
               <WorkflowBreadcrumb variant="view" label={workflow.title} />
               <div className="ml-auto hidden items-center gap-2 lg:flex" data-testid="header-actions">
                  <Button
                     asChild
                     variant="outline"
                     className="cursor-pointer"
                     data-testid="run-btn"
                  >
                     <Link href={`/workflows/${workflow.id}/run`}>Starten</Link>
                  </Button>
                  <Button
                     asChild
                     className="cursor-pointer bg-blue-700 hover:bg-blue-800"
                     data-testid="edit-btn"
                  >
                     <Link href={`/workflows/${workflow.id}/edit`}>
                        Bearbeiten
                     </Link>
                  </Button>
               </div>
            </div>
         </ItemDetailsViewHeader>
         <ItemDetailsViewContent>
            <ItemDetailsViewBody data-testid="workflow-view-body">
               <div className="space-y-6 px-6 py-8">
                  <WorkflowInfoCard workflow={workflow} />
                  <WorkflowStepsList workflow={workflow} />
               </div>
            </ItemDetailsViewBody>
         </ItemDetailsViewContent>
      </ItemDetailsView>
   );
};

const WorkflowInfoCard = ({ workflow }: { workflow: DWorkflowWithSteps }) => {
   return (
      <div
         className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
         data-testid="workflow-info-card"
      >
         <h1 className="text-2xl font-bold text-slate-900">{workflow.title}</h1>

         {workflow.description && (
            <p className="mt-2 text-sm text-slate-600">{workflow.description}</p>
         )}

         <Separator className="my-4" />

         <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
               <Layers className="h-4 w-4" />
               {workflow.stepCount}{" "}
               {workflow.stepCount === 1 ? "Schritt" : "Schritte"}
            </span>
            <span className="flex items-center gap-1.5">
               <CalendarDays className="h-4 w-4" />
               Zuletzt bearbeitet{" "}
               {format(new Date(workflow.updatedAt), "dd.MM.yyyy")}
            </span>
         </div>
      </div>
   );
};

const WorkflowStepsList = ({ workflow }: { workflow: DWorkflowWithSteps }) => {
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
         className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
         data-testid="step-card"
      >
         <div className="flex items-start gap-3">
            <span className="mt-0.5 w-5 shrink-0 text-right font-mono text-xs text-slate-400">
               {index + 1}.
            </span>
            <div className="min-w-0 flex-1 space-y-2">
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
                  <span className="font-medium text-slate-900">{step.title}</span>
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
                  <p className="text-xs text-slate-500">{step.hint}</p>
               )}

               {step.outgoingEdges.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                     {step.outgoingEdges
                        .slice()
                        .sort((a, b) => a.order - b.order)
                        .map((edge) => {
                           const target = allSteps.find(
                              (s) => s.id === edge.toStepId
                           );
                           return (
                              <span
                                 key={edge.id}
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

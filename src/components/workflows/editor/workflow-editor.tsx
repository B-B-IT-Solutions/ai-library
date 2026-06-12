"use client";

import { useState } from "react";
import { Play, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { setStartStep } from "@/data/actions/workflow";
import {
   DWorkflowStep,
   DWorkflowsUsage,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";
import { DeleteStepDialog } from "../dialogs/delete-step-dialog";

import { StepDetailPanel } from "./step-detail-panel";
import { StepList } from "./step-list";
import { WorkflowMetadataForm } from "./workflow-metadata-form";

type Props = {
   initialWorkflow: DWorkflowWithSteps | null;
   usage?: DWorkflowsUsage;
};

export const WorkflowEditor = ({ initialWorkflow, usage }: Props) => {
   const [workflow, setWorkflow] = useState<DWorkflowWithSteps | null>(
      initialWorkflow
   );
   const [selectedStep, setSelectedStep] = useState<DWorkflowStep | null>(null);
   const [createMode, setCreateMode] = useState(false);
   const [deleteStep, setDeleteStep] = useState<DWorkflowStep | null>(null);

   const steps = workflow?.steps ?? [];

   // Step limit check for BASIC tier
   const isAtStepLimit =
      usage !== undefined &&
      usage.limit !== -1 &&
      steps.length >= (usage.limit === 0 ? 0 : 10); // BASIC = 10 steps

   const handleWorkflowSaved = (saved: DWorkflowWithSteps) => {
      setWorkflow(saved);
   };

   const handleStepSaved = (saved: DWorkflowWithSteps) => {
      setWorkflow(saved);
      const updatedStep = saved.steps.find((s) => s.id === selectedStep?.id);
      if (updatedStep) {
         setSelectedStep(updatedStep);
      } else {
         setSelectedStep(null);
         setCreateMode(false);
      }
   };

   const handleSetStartStep = async (step: DWorkflowStep) => {
      if (!workflow) return;
      const result = await setStartStep(workflow.id, step.id);
      if (result.success) {
         // Optimistic update
         setWorkflow((prev) => {
            if (!prev) return prev;
            return {
               ...prev,
               steps: prev.steps.map((s) => ({
                  ...s,
                  isStart: s.id === step.id,
               })),
            };
         });
         if (selectedStep?.id === step.id) {
            setSelectedStep((s) => (s ? { ...s, isStart: true } : s));
         }
      } else {
         toast.error(result.message);
      }
   };

   const handleStepDeleted = (updated: DWorkflowWithSteps) => {
      setWorkflow(updated);
      if (deleteStep && selectedStep?.id === deleteStep.id) {
         setSelectedStep(null);
      }
      setDeleteStep(null);
   };

   const rightPanelContent = () => {
      if (createMode || selectedStep) {
         return (
            <StepDetailPanel
               workflowId={workflow!.id}
               step={selectedStep}
               allSteps={steps}
               onSaved={handleStepSaved}
               onCreateMode={createMode && !selectedStep}
               onCancelCreate={() => {
                  setCreateMode(false);
                  setSelectedStep(null);
               }}
            />
         );
      }
      return (
         <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Wähle einen Schritt aus der Liste oder erstelle einen neuen.
         </div>
      );
   };

   return (
      <>
         <div className="grid h-full grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-0 overflow-hidden">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-4 overflow-y-auto border-r bg-slate-50 p-4">
               <WorkflowMetadataForm
                  workflow={workflow}
                  onSaved={handleWorkflowSaved}
               />

               {workflow && (
                  <>
                     <div className="flex-1">
                        <div className="mb-2 flex items-center justify-between">
                           <span className="text-sm font-semibold text-slate-700">
                              Schritte
                           </span>
                        </div>
                        <StepList
                           workflow={workflow}
                           selectedStepId={selectedStep?.id ?? null}
                           onSelectStep={(step) => {
                              setSelectedStep(step);
                              setCreateMode(false);
                           }}
                           onSetStartStep={handleSetStartStep}
                           onDeleteStep={(step) => setDeleteStep(step)}
                        />
                     </div>

                     {/* + Schritt hinzufügen */}
                     {isAtStepLimit ? (
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <span className="w-full">
                                 <Button
                                    className="w-full"
                                    variant="outline"
                                    disabled
                                 >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Schritt hinzufügen
                                 </Button>
                              </span>
                           </TooltipTrigger>
                           <TooltipContent>
                              Maximale Schrittanzahl erreicht (10/10). Upgrade
                              auf PRO.
                           </TooltipContent>
                        </Tooltip>
                     ) : (
                        <Button
                           variant="outline"
                           className="w-full"
                           onClick={() => {
                              setSelectedStep(null);
                              setCreateMode(true);
                           }}
                           data-testid="add-step-btn"
                        >
                           <Plus className="mr-2 h-4 w-4" />
                           Schritt hinzufügen
                        </Button>
                     )}

                     {steps.length > 0 && (
                        <Button asChild variant="default">
                           <Link href={`/workflows/${workflow.id}/run`}>
                              <Play className="mr-2 h-4 w-4" />
                              Workflow ausführen
                           </Link>
                        </Button>
                     )}
                  </>
               )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="overflow-y-auto bg-white">
               {rightPanelContent()}
            </div>
         </div>

         {deleteStep && workflow && (
            <DeleteStepDialog
               open={!!deleteStep}
               onOpenChange={(open) => !open && setDeleteStep(null)}
               stepId={deleteStep.id}
               stepTitle={deleteStep.title}
               workflowId={workflow.id}
               onDeleted={handleStepDeleted}
            />
         )}
      </>
   );
};

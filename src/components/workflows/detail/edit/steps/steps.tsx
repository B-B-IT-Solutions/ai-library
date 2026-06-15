"use client";

import { useState } from "react";
import { Plus, Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { setStartStep } from "@/data/actions/workflow";
import {
   DWorkflowStep,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";
import { DeleteStepDialog } from "../../../dialogs/delete-step-dialog";

import { StepDetailPanel } from "./step-detail-panel";
import { StepItem } from "./step-item.";

type Props = {
   workflow: DWorkflowWithSteps;
};

export const WorkflowSteps = ({ workflow }: Props) => {
   const [selectedStep, setSelectedStep] = useState<
      DWorkflowStep | undefined
   >();
   const [createMode, setCreateMode] = useState(false);
   const [deleteStep, setDeleteStep] = useState<DWorkflowStep | null>(null);

   // Step form state
   const [stepIsDirty, setStepIsDirty] = useState(false);

   const steps = workflow?.steps ?? [];

   const handleStepSaved = (saved: DWorkflowWithSteps) => {
      //   setWorkflow(saved);
      const updatedStep = saved.steps.find((s) => s.id === selectedStep?.id);
      setSelectedStep(updatedStep ?? undefined);
      if (!updatedStep) setCreateMode(false);
   };

   const handleSetStartStep = async (step: DWorkflowStep) => {
      if (!workflow) return;
      const result = await setStartStep(workflow.id, step.id);
      if (result.success) {
         //  setWorkflow((prev) =>
         //     prev
         //        ? {
         //             ...prev,
         //             steps: prev.steps.map((s) => ({
         //                ...s,
         //                isStart: s.id === step.id,
         //             })),
         //          }
         //        : prev
         //  );
         //  if (selectedStep?.id === step.id) {
         //     setSelectedStep((s) => (s ? { ...s, isStart: true } : s));
         //  }
      } else {
         toast.error(result.message);
      }
   };

   const handleStepDeleted = (updated: DWorkflowWithSteps) => {
      //   setWorkflow(updated);
      if (deleteStep && selectedStep?.id === deleteStep.id) {
         setSelectedStep(undefined);
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
                  setSelectedStep(undefined);
               }}
               onDirtyChange={setStepIsDirty}
            />
         );
      }

      return (
         <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
            <p className="text-sm text-muted-foreground">
               Wähle links einen Schritt zum Bearbeiten
            </p>
            <Button
               variant="outline"
               size="sm"
               onClick={() => {
                  setSelectedStep(undefined);
                  setCreateMode(true);
               }}
            >
               <Plus className="mr-2 h-4 w-4" />
               Neuen Schritt erstellen
            </Button>
         </div>
      );
   };

   const hasStart = steps.some((s) => s.isStart);

   return (
      <>
         <div
            className="grid h-full grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
            data-testid="workflow-steps"
         >
            <div className="flex flex-col gap-4 overflow-y-auto border-r bg-slate-50 p-4">
               <div className="space-y-2" data-testid="step-list">
                  {!hasStart && steps.length > 0 && (
                     <div className="flex items-center gap-2 rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
                        <Star className="h-4 w-4 shrink-0" />
                        Kein Startschritt gesetzt
                     </div>
                  )}

                  {steps.map((step, idx) => {
                     return (
                        <StepItem
                           key={idx}
                           step={step}
                           index={idx}
                           allSteps={steps}
                           selectedStepId={selectedStep?.id ?? null}
                           onSelectStep={(step) => {
                              setSelectedStep(step);
                              setCreateMode(false);
                           }}
                           onSetStartStep={handleSetStartStep}
                           onDeleteStep={(step) => setDeleteStep(step)}
                        />
                     );
                  })}
               </div>

               <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                     setSelectedStep(undefined);
                     setCreateMode(true);
                  }}
                  data-testid="add-step-btn"
               >
                  <Plus className="mr-2 h-4 w-4" />
                  Schritt hinzufügen
               </Button>
            </div>

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

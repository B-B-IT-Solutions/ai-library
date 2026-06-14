"use client";

import { useRef, useState } from "react";
import { ChevronLeft, GitBranch, Play, Plus, Zap } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from "@/components/shadcn/alert-dialog";
import { Button } from "@/components/shadcn/button";
import { setStartStep } from "@/data/actions/workflow";
import {
   DWorkflow,
   DWorkflowStep,
   DWorkflowsUsage,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";
import { DeleteStepDialog } from "../../dialogs/delete-step-dialog";

import { WorkflowForm } from "./form";
import { StepDetailPanel } from "./steps/step-detail-panel";
import { StepList } from "./steps/step-list";

type Props = {
   initialWorkflow?: DWorkflowWithSteps;
   usage?: DWorkflowsUsage;
};

export const WorkflowEdit = ({ initialWorkflow, usage }: Props) => {
   const [workflow, setWorkflow] = useState<DWorkflowWithSteps | undefined>(
      initialWorkflow
   );
   const [selectedStep, setSelectedStep] = useState<DWorkflowStep | null>(null);
   const [createMode, setCreateMode] = useState(false);
   const [deleteStep, setDeleteStep] = useState<DWorkflowStep | null>(null);
   const [stepIsDirty, setStepIsDirty] = useState(false);
   const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
   const pendingNavigationRef = useRef<(() => void) | null>(null);

   const steps = workflow?.steps ?? [];

   // Step limit check for BASIC tier
   const isAtStepLimit =
      usage !== undefined &&
      usage.limit !== -1 &&
      steps.length >= (usage.limit === 0 ? 0 : 10); // BASIC = 10 steps

   // Guard navigation when step form has unsaved changes
   const guardNavigation = (action: () => void) => {
      if (stepIsDirty) {
         pendingNavigationRef.current = action;
         setShowUnsavedDialog(true);
         return;
      }
      action();
   };

   const handleConfirmNavigation = () => {
      pendingNavigationRef.current?.();
      pendingNavigationRef.current = null;
      setShowUnsavedDialog(false);
      setStepIsDirty(false);
   };

   const handleCancelNavigation = () => {
      pendingNavigationRef.current = null;
      setShowUnsavedDialog(false);
   };

   const handleWorkflowSaved = (saved: DWorkflow) => {
      const updatedWorkflow: DWorkflowWithSteps = {
         ...saved,
         steps: workflow?.steps ?? [],
      };
      setWorkflow(updatedWorkflow);
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
               onDirtyChange={setStepIsDirty}
            />
         );
      }

      if (steps.length === 0 && workflow) {
         return (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
               <div className="rounded-full bg-slate-100 p-4">
                  <GitBranch className="h-8 w-8 text-slate-400" />
               </div>
               <div>
                  <h3 className="text-base font-semibold text-slate-900">
                     Noch keine Schritte
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                     Erstelle den ersten Schritt, um deinen Workflow
                     aufzubauen.
                  </p>
               </div>
               <Button
                  onClick={() => {
                     setSelectedStep(null);
                     setCreateMode(true);
                  }}
               >
                  <Plus className="mr-2 h-4 w-4" />
                  Ersten Schritt erstellen
               </Button>
               <div className="mt-2 max-w-xs rounded-lg border bg-slate-50 p-4 text-left text-sm">
                  <p className="mb-2 font-medium text-slate-800">
                     Wie funktioniert ein Workflow?
                  </p>
                  <ol className="list-inside list-decimal space-y-1 text-slate-600">
                     <li>Schritte = einzelne Prompts oder Templates</li>
                     <li>Verbindungen = Übergänge zwischen Schritten</li>
                     <li>Startschritt = wo der Workflow beginnt</li>
                  </ol>
               </div>
            </div>
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
               onClick={() =>
                  guardNavigation(() => {
                     setSelectedStep(null);
                     setCreateMode(true);
                  })
               }
            >
               <Plus className="mr-2 h-4 w-4" />
               Neuen Schritt erstellen
            </Button>
         </div>
      );
   };

   return (
      <>
         <div className="flex h-full flex-col">
            {/* STICKY HEADER */}
            <div className="flex shrink-0 items-center justify-between border-b bg-white px-4 py-3">
               <div className="flex min-w-0 items-center gap-2">
                  <Link
                     href="/workflows"
                     className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                     <ChevronLeft className="h-4 w-4" />
                     Workflows
                  </Link>
                  <span className="text-muted-foreground">/</span>
                  <span className="truncate text-sm font-semibold text-slate-900">
                     {workflow?.title || "Neuer Workflow"}
                  </span>
               </div>

               {workflow && steps.length > 0 && (
                  <Button asChild size="sm">
                     <Link href={`/workflows/${workflow.id}/run`}>
                        <Play className="mr-2 h-4 w-4" />
                        Ausführen
                     </Link>
                  </Button>
               )}
            </div>

            {/* MAIN GRID */}
            <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
               {/* LEFT COLUMN */}
               <div className="flex flex-col gap-4 overflow-y-auto border-r bg-slate-50 p-4">
                  <WorkflowForm
                     workflow={workflow}
                     onSaved={handleWorkflowSaved}
                  />

                  {workflow && (
                     <>
                        <div className="flex-1">
                           <div className="mb-2 flex items-center justify-between">
                              <span className="text-sm font-semibold text-slate-700">
                                 Schritte
                                 {steps.length > 0 && (
                                    <span className="ml-1.5 font-normal text-muted-foreground">
                                       ({steps.length})
                                    </span>
                                 )}
                              </span>
                           </div>
                           <StepList
                              workflow={workflow}
                              selectedStepId={selectedStep?.id ?? null}
                              onSelectStep={(step) =>
                                 guardNavigation(() => {
                                    setSelectedStep(step);
                                    setCreateMode(false);
                                 })
                              }
                              onSetStartStep={handleSetStartStep}
                              onDeleteStep={(step) => setDeleteStep(step)}
                           />
                        </div>

                        {isAtStepLimit ? (
                           <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                              <div className="flex items-start gap-2">
                                 <Zap className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                                 <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-amber-900">
                                       Schritt-Limit erreicht (10/10)
                                    </p>
                                    <p className="mt-0.5 text-xs text-amber-700">
                                       Mit PRO sind unbegrenzte Schritte
                                       möglich.
                                    </p>
                                    <Button
                                       asChild
                                       size="sm"
                                       variant="outline"
                                       className="mt-2 w-full"
                                    >
                                       <Link href="/settings/billing">
                                          Auf PRO upgraden →
                                       </Link>
                                    </Button>
                                 </div>
                              </div>
                           </div>
                        ) : (
                           <Button
                              variant="outline"
                              className="w-full"
                              onClick={() =>
                                 guardNavigation(() => {
                                    setSelectedStep(null);
                                    setCreateMode(true);
                                 })
                              }
                              data-testid="add-step-btn"
                           >
                              <Plus className="mr-2 h-4 w-4" />
                              Schritt hinzufügen
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
         </div>

         {/* Unsaved changes confirmation */}
         <AlertDialog
            open={showUnsavedDialog}
            onOpenChange={(open) => !open && handleCancelNavigation()}
         >
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Ungespeicherte Änderungen</AlertDialogTitle>
                  <AlertDialogDescription>
                     {selectedStep
                        ? `Der Schritt "${selectedStep.title}" hat ungespeicherte Änderungen.`
                        : "Du hast ungespeicherte Änderungen."}{" "}
                     Möchtest du sie verwerfen?
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel onClick={handleCancelNavigation}>
                     Zurück zum Formular
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmNavigation}>
                     Verwerfen
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>

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

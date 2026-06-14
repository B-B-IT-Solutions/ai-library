"use client";

import { useRef, useState } from "react";
import { Loader2, Play, Plus, Zap } from "lucide-react";
import { GitBranch } from "lucide-react";
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
import {
   Tabs,
   TabsContent,
   TabsList,
   TabsTrigger,
} from "@/components/shadcn/tabs";
import { ItemDetailsBreadcrumb } from "@/components/shared/breadcrumbs";
import {
   ItemDetailsEdit,
   ItemDetailsEditHeader,
} from "@/components/shared/wrappers/item-details";
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

const FORM_ID = "workflow-edit-form";

const TAB_TRIGGER_CLASS =
   "rounded-none border-b border-transparent px-4 py-2.5 text-sm shadow-none data-[state=active]:rounded-t-sm data-[state=active]:border-b-blue-600 data-[state=active]:text-blue-700 data-[state=active]:shadow-none disabled:cursor-not-allowed disabled:opacity-40";

type Props = {
   initialWorkflow?: DWorkflowWithSteps;
   usage?: DWorkflowsUsage;
};

export const WorkflowEdit = ({ initialWorkflow, usage }: Props) => {
   const [workflow, setWorkflow] = useState<DWorkflowWithSteps | undefined>(
      initialWorkflow
   );
   const [activeTab, setActiveTab] = useState("details");
   const [selectedStep, setSelectedStep] = useState<
      DWorkflowStep | undefined
   >();
   const [createMode, setCreateMode] = useState(false);
   const [deleteStep, setDeleteStep] = useState<DWorkflowStep | null>(null);

   // Workflow form state (lifted from WorkflowForm)
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [workflowFormIsDirty, setWorkflowFormIsDirty] = useState(false);

   // Step form state
   const [stepIsDirty, setStepIsDirty] = useState(false);
   const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
   const pendingNavigationRef = useRef<(() => void) | null>(null);

   const steps = workflow?.steps ?? [];
   const isEdit = !!workflow;

   const isAtStepLimit =
      usage !== undefined &&
      usage.limit !== -1 &&
      steps.length >= (usage.limit === 0 ? 0 : 10);

   // Guard step navigation when step form is dirty
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
      // After creating a new workflow, switch to steps tab
      if (!isEdit) {
         setActiveTab("steps");
      }
   };

   const handleStepSaved = (saved: DWorkflowWithSteps) => {
      setWorkflow(saved);
      const updatedStep = saved.steps.find((s) => s.id === selectedStep?.id);
      if (updatedStep) {
         setSelectedStep(updatedStep);
      } else {
         setSelectedStep(undefined);
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
         setSelectedStep(undefined);
      }
      setDeleteStep(null);
   };

   const breadcrumb = () => {
      if (!isEdit) {
         return (
            <ItemDetailsBreadcrumb
               root={{ label: "Workflows", href: "/workflows" }}
               variant="new"
               page={{ label: "Neuer Workflow" }}
               data-testid="workflow-breadcrumb"
            />
         );
      }
      return (
         <ItemDetailsBreadcrumb
            root={{ label: "Workflows", href: "/workflows" }}
            variant="edit"
            link={{
               href: `/workflows/${workflow.id}`,
               label: workflow.title,
               tooltip: workflow.title,
            }}
            data-testid="workflow-breadcrumb"
         />
      );
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

      if (steps.length === 0) {
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
                     Erstelle den ersten Schritt, um deinen Workflow aufzubauen.
                  </p>
               </div>
               <Button
                  onClick={() => {
                     setSelectedStep(undefined);
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
                     setSelectedStep(undefined);
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
         <ItemDetailsEdit data-testid="workflow-edit">
            <ItemDetailsEditHeader>
               {breadcrumb()}
               <div className="ml-auto flex items-center gap-2">
                  {isEdit && steps.length > 0 && (
                     <Button asChild size="sm" variant="outline">
                        <Link href={`/workflows/${workflow.id}/run`}>
                           <Play className="mr-2 h-4 w-4" />
                           Ausführen
                        </Link>
                     </Button>
                  )}
                  {activeTab === "details" && (
                     <Button
                        type="submit"
                        form={FORM_ID}
                        size="sm"
                        disabled={isSubmitting || !workflowFormIsDirty}
                        className="bg-blue-700 hover:bg-blue-800"
                        data-testid="save-workflow-meta-btn"
                     >
                        {isSubmitting && (
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isEdit ? "Speichern" : "Erstellen"}
                     </Button>
                  )}
               </div>
            </ItemDetailsEditHeader>

            <Tabs
               value={activeTab}
               onValueChange={setActiveTab}
               className="flex flex-1 flex-col overflow-hidden"
            >
               <TabsList className="h-auto w-full gap-0 rounded-none border-b border-slate-200 bg-transparent p-0">
                  <TabsTrigger
                     value="details"
                     className={TAB_TRIGGER_CLASS}
                     data-testid="tab-details-btn"
                  >
                     Details
                  </TabsTrigger>
                  <TabsTrigger
                     value="steps"
                     disabled={!isEdit}
                     className={TAB_TRIGGER_CLASS}
                     data-testid="tab-steps-btn"
                  >
                     Schritte
                     {steps.length > 0 && (
                        <span className="ml-1.5 text-xs text-muted-foreground">
                           ({steps.length})
                        </span>
                     )}
                  </TabsTrigger>
               </TabsList>

               {/* Details Tab */}
               <TabsContent value="details" className="overflow-y-auto">
                  <div className="mx-auto max-w-2xl px-6 py-8">
                     <WorkflowForm
                        workflow={workflow}
                        formId={FORM_ID}
                        onSaved={handleWorkflowSaved}
                        onSubmittingChange={setIsSubmitting}
                        onDirtyChange={setWorkflowFormIsDirty}
                     />
                  </div>
               </TabsContent>

               {/* Steps Tab */}
               {isEdit && (
                  <TabsContent value="steps" className="overflow-hidden">
                     <div className="grid h-full grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                        {/* LEFT: step list */}
                        <div className="flex flex-col gap-4 overflow-y-auto border-r bg-slate-50 p-4">
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
                                       setSelectedStep(undefined);
                                       setCreateMode(true);
                                    })
                                 }
                                 data-testid="add-step-btn"
                              >
                                 <Plus className="mr-2 h-4 w-4" />
                                 Schritt hinzufügen
                              </Button>
                           )}
                        </div>

                        {/* RIGHT: step detail */}
                        <div className="overflow-y-auto bg-white">
                           {rightPanelContent()}
                        </div>
                     </div>
                  </TabsContent>
               )}
            </Tabs>
         </ItemDetailsEdit>

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

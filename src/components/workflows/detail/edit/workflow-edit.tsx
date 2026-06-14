"use client";

import { useRef, useState } from "react";
import { Loader2, Play } from "lucide-react";
import Link from "next/link";

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
import {
   DWorkflow,
   DWorkflowsUsage,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";

import { WorkflowForm } from "./form";
import { StepDetailPanelRef } from "./steps/step-detail-panel";
import { WorkflowSteps } from "./steps/steps";

const FORM_ID = "workflow-edit-form";

const TAB_TRIGGER_CLASS =
   "rounded-none border-b border-transparent px-4 py-2.5 text-sm shadow-none data-[state=active]:rounded-t-sm data-[state=active]:border-b-blue-600 data-[state=active]:text-blue-700 data-[state=active]:shadow-none disabled:cursor-not-allowed disabled:opacity-40";

type Props = {
   initialWorkflow?: DWorkflowWithSteps;
   usage?: DWorkflowsUsage;
};

export const WorkflowEdit = ({ initialWorkflow }: Props) => {
   const [workflow, setWorkflow] = useState<DWorkflowWithSteps | undefined>(
      initialWorkflow
   );
   const [activeTab, setActiveTab] = useState("details");
   const [createMode, setCreateMode] = useState(false);

   // Workflow form state lifted from WorkflowForm
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [workflowFormIsDirty, setWorkflowFormIsDirty] = useState(false);

   // Step form state
   const [stepIsDirty, setStepIsDirty] = useState(false);
   const stepPanelRef = useRef<StepDetailPanelRef>(null);

   const steps = workflow?.steps ?? [];
   const isEdit = !!workflow;
   const hasAnyChanges = workflowFormIsDirty || stepIsDirty || createMode;

   /** Global save: saves current step (if dirty) + workflow metadata (if dirty). */
   const handleGlobalSave = async () => {
      if (stepIsDirty && stepPanelRef.current) {
         try {
            await stepPanelRef.current.submit();
         } catch {
            return; // toast already shown inside submit
         }
      }
      if (workflowFormIsDirty) {
         const formEl = document.getElementById(FORM_ID);
         if (formEl instanceof HTMLFormElement) formEl.requestSubmit();
      }
   };

   const handleWorkflowSaved = (saved: DWorkflow) => {
      setWorkflow({ ...saved, steps: workflow?.steps ?? [] });
      if (!isEdit) {
         setActiveTab("steps");
      }
   };

   const breadcrumb = () =>
      isEdit ? (
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
      ) : (
         <ItemDetailsBreadcrumb
            root={{ label: "Workflows", href: "/workflows" }}
            variant="new"
            page={{ label: "Neuer Workflow" }}
            data-testid="workflow-breadcrumb"
         />
      );

   return (
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
               <Button
                  type="button"
                  size="sm"
                  disabled={isSubmitting || !hasAnyChanges}
                  className="bg-blue-700 hover:bg-blue-800"
                  onClick={handleGlobalSave}
                  data-testid="save-workflow-meta-btn"
               >
                  {isSubmitting && (
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEdit ? "Speichern" : "Erstellen"}
               </Button>
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
                  {workflowFormIsDirty && (
                     <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
                  )}
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
                  {stepIsDirty && (
                     <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
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
                  <WorkflowSteps workflow={workflow} />
               </TabsContent>
            )}
         </Tabs>
      </ItemDetailsEdit>
   );
};

"use client";

import { useMemo, useRef, useState } from "react";
import { Loader } from "lucide-react";
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
import { worfklowEditNavigateBackUrl } from "../../utils/utils";

import { WorkflowForm } from "./form";
import { StepDetailPanelRef } from "./steps/step-detail-panel";
import { WorkflowSteps } from "./steps/steps";

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
         const formEl = document.getElementById(formId);
         if (formEl instanceof HTMLFormElement) formEl.requestSubmit();
      }
   };

   const handleWorkflowSaved = (saved: DWorkflow) => {
      setWorkflow({ ...saved, steps: workflow?.steps ?? [] });
      if (!isEdit) {
         setActiveTab("steps");
      }
   };

   const backUrl = useMemo(
      () => worfklowEditNavigateBackUrl(workflow),
      [workflow]
   );

   const formId = "workflow-edit-form";

   // const breadcrumbs = () => {
   //    if (prompt) {
   //       return (
   //          <PromptBreadcrumb
   //             variant="edit"
   //             prompt={prompt}
   //             currentCollection={currentCollection}
   //          />
   //       );
   //    }
   //    return (
   //       <PromptBreadcrumb
   //          variant="new"
   //          currentCollection={currentCollection}
   //       />
   //    );
   // };

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

   const cancelBtn = () => {
      return (
         <Button
            asChild={true}
            type="button"
            variant="outline"
            disabled={isSubmitting}
            className="cursor-pointer"
            data-testid="cancel-btn"
         >
            <Link href={backUrl}>Abbrechen</Link>
         </Button>
      );
   };

   const submitBtn = () => {
      return (
         <Button
            type="submit"
            form={formId}
            disabled={isSubmitting || !hasAnyChanges}
            onClick={handleGlobalSave}
            className="cursor-pointer bg-blue-700 hover:bg-blue-800"
            data-testid="save-btn"
         >
            {isSubmitting ? (
               <>
                  <Loader className="h-4 w-4 animate-spin" />
                  {isEdit ? "Wird gespeichert..." : "Wird erstellt..."}
               </>
            ) : (
               <>{isEdit ? "Workflow speichern" : "Workflow erstellen"}</>
            )}
         </Button>
      );
   };

   const actions = () => {
      return (
         <div className="flex items-center gap-2">
            {cancelBtn()}
            {submitBtn()}
         </div>
      );
   };

   return (
      <ItemDetailsEdit data-testid="workflow-edit">
         <ItemDetailsEditHeader>
            {breadcrumb()}
            <div
               className="ml-auto hidden lg:flex"
               data-testid="header-actions"
            >
               {actions()}
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
            <TabsContent value="details" className="overflow-y-auto">
               <div className="mx-auto max-w-2xl px-6 py-8">
                  <WorkflowForm
                     workflow={workflow}
                     formId={formId}
                     onSaved={handleWorkflowSaved}
                     onSubmittingChange={setIsSubmitting}
                     onDirtyChange={setWorkflowFormIsDirty}
                  />
               </div>
            </TabsContent>
            {isEdit && (
               <TabsContent value="steps" className="overflow-hidden">
                  <WorkflowSteps workflow={workflow} />
               </TabsContent>
            )}
         </Tabs>
      </ItemDetailsEdit>
   );
};

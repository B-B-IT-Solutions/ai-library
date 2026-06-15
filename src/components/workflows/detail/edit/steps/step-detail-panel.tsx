"use client";

import { Control } from "react-hook-form";

import {
   DWorkflowStep,
   DWorkflowStepUpdate,
   DWorkflowUpdate,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";

import { StepForm } from "./step-form";

type Props = {
   workflowId: string;
   index: number;
   step?: DWorkflowStepUpdate;
   allSteps: DWorkflowStep[];
   onSaved: (workflow: DWorkflowWithSteps) => void;
   onCreateMode?: boolean;
   onCancelCreate?: () => void;
   control: Control<DWorkflowUpdate>;
};

export const StepDetailPanel = ({
   workflowId,
   index,
   step,
   allSteps,
   onSaved,
   onCreateMode = false,
   onCancelCreate,
   control,
}: Props) => {
   const submitInternal = async (values: DWorkflowStepUpdate) => {
      // const payload = {
      //    ...values,
      //    promptId:
      //       values.type === "PROMPT_REF" ? values.promptId || null : null,
      //    content: values.type === "STANDALONE" ? values.content : null,
      //    hint: values.hint || null,
      // };
      // const result = step
      //    ? await updateWorkflowStep(step.id, workflowId, payload)
      //    : await createWorkflowStep(workflowId, payload);
      // if (result.success && result.data) {
      //    toast.success(result.message);
      //    onSaved(result.data);
      //    if (onCreateMode && onCancelCreate) {
      //       onCancelCreate();
      //    }
      // } else {
      //    toast.error(result.message);
      //    throw new Error(result.message);
      // }
   };

   return (
      <div
         className="flex h-full flex-col overflow-y-auto"
         data-testid="step-detail-panel"
      >
         <div className="shrink-0 border-b bg-white px-5 py-4">
            <div className="flex items-center gap-2">
               <h2 className="font-semibold text-slate-900">
                  {onCreateMode ? "Neuer Schritt" : "Schritt bearbeiten"}
               </h2>
            </div>
            {step?.title && !onCreateMode && (
               <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  {step.title}
               </p>
            )}
         </div>

         <StepForm
            key={step?.edgeId}
            workflowId={workflowId}
            index={index}
            step={step}
            allSteps={allSteps}
            onSaved={onSaved}
            onCreateMode={onCreateMode}
            onCancelCreate={onCancelCreate}
            control={control}
         />
      </div>
   );
};

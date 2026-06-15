"use client";

import { toast } from "sonner";

import {
   createWorkflowStep,
   updateWorkflowStep,
} from "@/data/actions/workflow";
import {
   DWorkflowStep,
   DWorkflowStepUpdate,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";

import { StepForm } from "./step-form";

type Props = {
   workflowId: string;
   step?: DWorkflowStep;
   allSteps: DWorkflowStep[];
   onSaved: (workflow: DWorkflowWithSteps) => void;
   onCreateMode?: boolean;
   onCancelCreate?: () => void;
   onDirtyChange?: (dirty: boolean) => void;
};

export const StepDetailPanel = ({
   workflowId,
   step,
   allSteps,
   onSaved,
   onCreateMode = false,
   onCancelCreate,
   onDirtyChange,
}: Props) => {
   const submitInternal = async (values: DWorkflowStepUpdate) => {
      const payload = {
         ...values,
         promptId:
            values.type === "PROMPT_REF" ? values.promptId || null : null,
         content: values.type === "STANDALONE" ? values.content : null,
         hint: values.hint || null,
      };

      const result = step
         ? await updateWorkflowStep(step.id, workflowId, payload)
         : await createWorkflowStep(workflowId, payload);

      if (result.success && result.data) {
         toast.success(result.message);
         onSaved(result.data);
         if (onCreateMode && onCancelCreate) {
            onCancelCreate();
         }
      } else {
         toast.error(result.message);
         throw new Error(result.message);
      }
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
            key={step?.id}
            workflowId={workflowId}
            step={step}
            allSteps={allSteps}
            onSaved={onSaved}
            onCreateMode={onCreateMode}
            onCancelCreate={onCancelCreate}
            onDirtyChange={onDirtyChange}
         />
      </div>
   );
};

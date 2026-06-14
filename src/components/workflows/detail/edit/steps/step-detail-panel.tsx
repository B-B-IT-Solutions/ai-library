"use client";

import {
   forwardRef,
   useEffect,
   useImperativeHandle,
   useRef,
   useState,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { getPromptPreviewsPage } from "@/data/actions/prompt";
import {
   createWorkflowStep,
   updateWorkflowStep,
} from "@/data/actions/workflow";
import { DPrompt } from "@/data/types/domain/prompt";
import {
   DWorkflowStep,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";
import { updateWorkflowStepSchema } from "@/data/types/validators/workflow";
import { initWorkflowStep } from "../utils";

import { StepForm } from "./step-form";

type FormValues = z.infer<typeof updateWorkflowStepSchema>;

export type StepDetailPanelRef = {
   /** Submits the form and returns a promise that resolves on success, rejects on failure or validation error. */
   submit: () => Promise<void>;
};

type Props = {
   workflowId: string;
   step?: DWorkflowStep;
   allSteps: DWorkflowStep[];
   onSaved: (workflow: DWorkflowWithSteps) => void;
   onCreateMode?: boolean;
   onCancelCreate?: () => void;
   onDirtyChange?: (dirty: boolean) => void;
};

export const StepDetailPanel = forwardRef<StepDetailPanelRef, Props>(
   (
      {
         workflowId,
         step,
         allSteps,
         onSaved,
         onCreateMode = false,
         onCancelCreate,
         onDirtyChange,
      },
      ref
   ) => {
      const [loading, setLoading] = useState(false);
      const [templates, setTemplates] = useState<DPrompt[]>([]);

      useEffect(() => {
         getPromptPreviewsPage().then(setTemplates).catch(console.error);
      }, []);

      const form = useForm<FormValues>({
         resolver: zodResolver(updateWorkflowStepSchema),
         defaultValues: initWorkflowStep(step),
      });

      // Reset form when selected step changes
      useEffect(() => {
         if (step) {
            form.reset(initWorkflowStep(step));
         }
      }, [step, form]);

      // Propagate dirty state to parent
      const onDirtyChangeRef = useRef(onDirtyChange);
      onDirtyChangeRef.current = onDirtyChange;
      const isDirty = form.formState.isDirty;
      useEffect(() => {
         onDirtyChangeRef.current?.(isDirty);
      }, [isDirty]);

      const submitInternal = async (values: FormValues) => {
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

      // Expose submit to parent via ref
      useImperativeHandle(ref, () => ({
         submit: () =>
            new Promise<void>((resolve, reject) => {
               form.handleSubmit(
                  async (values) => {
                     setLoading(true);
                     try {
                        await submitInternal(values);
                        resolve();
                     } catch {
                        reject();
                     } finally {
                        setLoading(false);
                     }
                  },
                  () => reject(new Error("Validation failed"))
               )();
            }),
      }));

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
                  {isDirty && (
                     <span
                        className="h-2 w-2 rounded-full bg-amber-400"
                        title="Ungespeicherte Änderungen"
                     />
                  )}
               </div>
               {step?.title && !onCreateMode && (
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                     {step.title}
                  </p>
               )}
            </div>

            <StepForm
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
   }
);

StepDetailPanel.displayName = "StepDetailPanel";

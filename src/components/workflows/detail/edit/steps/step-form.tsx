"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { filter, map } from "es-toolkit/compat";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { Form } from "@/components/shadcn/form";
import { Separator } from "@/components/shadcn/separator";
import {
   FormCheckBox,
   FormInput,
   FormMDEditor,
   FormSelect,
   FormSelectLoadableValues,
   FormTextArea,
} from "@/components/shared/widgets";
import { Option } from "@/components/shared/widgets/form-select";
import {
   createWorkflowStep,
   updateWorkflowStep,
} from "@/data/actions/workflow";
import { infiniteLoadPromptPreviewsPageOptions } from "@/data/ts-queries/prompt";
import {
   DWorkflowStep,
   DWorkflowStepUpdate,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";
import { updateWorkflowStepSchema } from "@/data/types/validators/workflow";
import { initWorkflowStep } from "../utils";

type Props = {
   workflowId: string;
   step?: DWorkflowStep;
   allSteps: DWorkflowStep[];
   onSaved: (workflow: DWorkflowWithSteps) => void;
   onCreateMode?: boolean;
   onCancelCreate?: () => void;
   onDirtyChange?: (dirty: boolean) => void;
};

export const StepForm = ({
   workflowId,
   step,
   allSteps,
   onSaved,
   onCreateMode = false,
   onCancelCreate,
}: Props) => {
   const [loading, setLoading] = useState(false);

   const form = useForm<DWorkflowStepUpdate>({
      resolver: zodResolver(updateWorkflowStepSchema),
      defaultValues: initWorkflowStep(step),
   });

   const {
      fields: edgeFields,
      append,
      remove,
   } = useFieldArray({ control: form.control, name: "edges" });

   const stepType = form.watch("type");

   const otherSteps = filter(allSteps, (s) => s.id !== step?.id);

   const edgeStepOptions: Option[] = map(otherSteps, (s) => {
      return {
         value: s.id,
         label: s.title,
      };
   });

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

   const onSubmit = async (values: DWorkflowStepUpdate) => {
      setLoading(true);
      try {
         await submitInternal(values);
      } finally {
         setLoading(false);
      }
   };

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-1 flex-col gap-5 overflow-y-auto p-5"
            data-testid="step-form"
         >
            <FormInput<DWorkflowStepUpdate>
               name="title"
               label="Titel"
               placeholder="Schritt Titel"
               required={true}
               control={form.control}
            />

            <FormSelect<DWorkflowStepUpdate>
               name="type"
               label="Typ des Schritts"
               placeholder="Standardwert auswählen"
               options={[
                  { value: "PROMPT_REF", label: "Prompt" },
                  { value: "STANDALONE", label: "Eigenständig" },
               ]}
               control={form.control}
            />

            {/* Prompt-Picker als Combobox */}
            {stepType === "PROMPT_REF" && (
               <FormSelectLoadableValues<DWorkflowStepUpdate>
                  name="promptId"
                  label="Prompt"
                  placeholder="Prompt suchen…"
                  required={true}
                  control={form.control}
                  queryOptions={(search) =>
                     infiniteLoadPromptPreviewsPageOptions({
                        filters: { search },
                        sort: { field: "title", order: "asc" },
                     })
                  }
               />
            )}

            {/* Standalone-Content */}
            {stepType === "STANDALONE" && (
               <FormMDEditor<DWorkflowStepUpdate>
                  name="content"
                  placeholder="Texts des Prompts"
                  control={form.control}
               />
            )}

            <FormCheckBox<DWorkflowStepUpdate>
               name="isStart"
               label="Ist Startschritt"
               control={form.control}
            />

            <FormTextArea<DWorkflowStepUpdate>
               name="hint"
               label="Hinwweis"
               placeholder="Kontext oder Anweisungen für den Nutzer im Runner"
               maxLength={750}
               rows={3}
               control={form.control}
            />

            <Separator />

            {/* Nächste Schritte / Edges */}
            <div className="space-y-3">
               <h3 className="text-sm font-semibold">Nächste Schritte</h3>

               {edgeFields.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                     Keine Verbindungen — dieser Schritt beendet den Workflow.
                  </p>
               )}

               {edgeFields.map((edgeField, idx) => (
                  <div
                     key={edgeField.id}
                     className="flex items-end gap-2 rounded-md border p-3"
                  >
                     <FormInput<DWorkflowStepUpdate>
                        name={`edges.${idx}.label`}
                        label="Label"
                        placeholder="z.B. Weiter"
                        maxLength={250}
                        className="flex-1"
                        control={form.control}
                     />

                     <FormSelect<DWorkflowStepUpdate>
                        name={`edges.${idx}.toStepId`}
                        label="Zielschritt"
                        placeholder="Schritt…"
                        className="flex-1"
                        options={edgeStepOptions}
                        control={form.control}
                     />

                     <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={() => remove(idx)}
                     >
                        <Trash2 className="h-4 w-4 text-destructive" />
                     </Button>
                  </div>
               ))}

               <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                     append({
                        toStepId: "",
                        label: "",
                        order: edgeFields.length,
                     })
                  }
                  className="w-full"
                  data-testid="add-edge-btn"
               >
                  <Plus className="mr-2 h-4 w-4" />
                  Verbindung hinzufügen
               </Button>
            </div>

            {form.formState.errors.edges?.message && (
               <p className="text-sm text-destructive">
                  {form.formState.errors.edges.message}
               </p>
            )}

            <div className="flex justify-end gap-2">
               {onCancelCreate && (
                  <Button
                     type="button"
                     variant="outline"
                     onClick={onCancelCreate}
                  >
                     Abbrechen
                  </Button>
               )}
               <Button
                  type="submit"
                  disabled={loading}
                  data-testid="save-step-btn"
               >
                  Schritt erstellen
               </Button>
            </div>
         </form>
      </Form>
   );
};

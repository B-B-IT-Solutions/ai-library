"use client";

import { filter, map } from "es-toolkit/compat";
import { Plus, Trash2 } from "lucide-react";
import { Control, useController, useFieldArray } from "react-hook-form";

import { Button } from "@/components/shadcn/button";
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
import { infiniteLoadPromptPreviewsPageOptions } from "@/data/ts-queries/prompt";
import {
   DWorkflowStep,
   DWorkflowStepUpdate,
   DWorkflowUpdate,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";

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

export const StepForm = ({ index, step, allSteps, control }: Props) => {
   const { field } = useController({
      name: `steps.${index}`,
      control,
   });

   const {
      fields: edgeFields,
      append,
      remove,
   } = useFieldArray({
      name: `steps.${index}.edges`,
      control,
   });

   const stepType = field.value.type;

   const otherSteps = filter(allSteps, (s) => s.edgeId !== step?.edgeId);

   const edgeStepOptions: Option[] = map(otherSteps, (s) => {
      return {
         value: s.id,
         label: s.title,
      };
   });

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
      <form
         className="flex flex-1 flex-col gap-5 overflow-y-auto p-5"
         data-testid="step-form"
      >
         <FormInput<DWorkflowUpdate>
            name={`steps.${index}.title`}
            label="Titel"
            placeholder="Schritt Titel"
            required={true}
            control={control}
         />

         <FormSelect<DWorkflowUpdate>
            name={`steps.${index}.type`}
            label="Typ des Schritts"
            placeholder="Standardwert auswählen"
            options={[
               { value: "PROMPT_REF", label: "Prompt" },
               { value: "STANDALONE", label: "Eigenständig" },
            ]}
            control={control}
         />

         {/* Prompt-Picker als Combobox */}
         {stepType === "PROMPT_REF" && (
            <FormSelectLoadableValues<DWorkflowUpdate>
               name={`steps.${index}.promptId`}
               label="Prompt"
               placeholder="Prompt suchen…"
               required={true}
               control={control}
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
            <FormMDEditor<DWorkflowUpdate>
               name={`steps.${index}.content`}
               placeholder="Texts des Prompts"
               control={control}
            />
         )}

         <FormCheckBox<DWorkflowUpdate>
            name={`steps.${index}.isStart`}
            label="Ist Startschritt"
            control={control}
         />

         <FormTextArea<DWorkflowUpdate>
            name={`steps.${index}.hint`}
            label="Hinwweis"
            placeholder="Kontext oder Anweisungen für den Nutzer im Runner"
            maxLength={750}
            rows={3}
            control={control}
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

            {edgeFields.map((edgeField, edgeIdx) => (
               <div
                  key={edgeField.id}
                  className="flex items-end gap-2 rounded-md border p-3"
               >
                  <FormInput<DWorkflowUpdate>
                     name={`steps.${index}.edges.${edgeIdx}.label`}
                     label="Label"
                     placeholder="z.B. Weiter"
                     maxLength={250}
                     className="flex-1"
                     control={control}
                  />

                  <FormSelect<DWorkflowUpdate>
                     name={`steps.${index}.edges.${edgeIdx}.toStepId`}
                     label="Zielschritt"
                     placeholder="Schritt…"
                     className="flex-1"
                     options={edgeStepOptions}
                     control={control}
                  />

                  <Button
                     type="button"
                     variant="ghost"
                     size="icon"
                     className="shrink-0"
                     onClick={() => remove(edgeIdx)}
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
      </form>
   );
};

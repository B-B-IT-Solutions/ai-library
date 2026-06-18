"use client";

import { filter, map } from "es-toolkit/compat";
import { Plus, Trash2 } from "lucide-react";
import {
   Control,
   useController,
   useFieldArray,
   useWatch,
} from "react-hook-form";

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
   DWorkflowStepEdgeUpdate,
   DWorkflowStepUpdate,
   DWorkflowUpdate,
} from "@/data/types/domain/workflow";

type Props = {
   index: number;
   steps: DWorkflowStepUpdate[];
   control: Control<DWorkflowUpdate>;
};

export const StepForm = ({ index, steps, control }: Props) => {
   const { field } = useController({
      name: `steps.${index}`,
      control,
   });

   const { type } = useWatch({
      name: `steps.${index}`,
      control,
   });

   const {
      fields: edges,
      append: addEdge,
      remove,
   } = useFieldArray({
      name: `steps.${index}.edges`,
      control,
   });

   const otherSteps = filter(steps, (s) => s.edgeId !== field.value.edgeId);

   const edgeStepOptions: Option[] = map(otherSteps, (s) => {
      return {
         value: s.edgeId,
         label: s.title,
      };
   });

   const handleAddEdge = () => {
      const newEdge: DWorkflowStepEdgeUpdate = {
         toStepId: "",
         label: "",
         order: edges.length + 1,
      };
      addEdge(newEdge);
   };

   return (
      <div
         className="flex h-full flex-1 flex-col gap-5 overflow-y-auto p-5"
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

         {type === "PROMPT_REF" && (
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

         {type === "STANDALONE" && (
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

            {edges.length === 0 && (
               <p className="text-sm text-muted-foreground">
                  Keine Verbindungen — dieser Schritt beendet den Workflow.
               </p>
            )}

            {map(edges, (_, edgeIdx) => (
               <div
                  key={edgeIdx}
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
                     data-testid="remove-edge-btn"
                  >
                     <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
               </div>
            ))}

            <div>
               <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddEdge}
                  className="mx-auto"
                  data-testid="add-edge-btn"
               >
                  <Plus className="mr-2 h-4 w-4" />
                  Verbindung hinzufügen
               </Button>
            </div>
         </div>
      </div>
   );
};

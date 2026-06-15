"use client";

import { useState } from "react";
import { filter, map } from "es-toolkit/compat";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { Control, Path, useFieldArray, useWatch } from "react-hook-form";

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
import { WorkflowEditFormValues } from "@/data/types/domain/workflow";
import { cn } from "@/lib/utils";

type Props = {
   control: Control<WorkflowEditFormValues>;
   index: number;
   removeStep: (index: number) => void;
   defaultExpanded?: boolean;
};

export const StepEditItem = ({
   control,
   index,
   removeStep,
   defaultExpanded = false,
}: Props) => {
   const [expanded, setExpanded] = useState(defaultExpanded);

   const stepTitle = useWatch({ control, name: `steps.${index}.title` });
   const stepType = useWatch({ control, name: `steps.${index}.type` });
   const stepId = useWatch({ control, name: `steps.${index}.id` });
   const allSteps = useWatch({ control, name: "steps" });

   const {
      fields: edgeFields,
      append: addEdge,
      remove: removeEdge,
   } = useFieldArray({
      control,
      name: `steps.${index}.edges` as any,
   });

   const otherSavedSteps = filter(
      allSteps,
      (s, i) => i !== index && Boolean(s.id)
   );
   const edgeStepOptions: Option[] = map(otherSavedSteps, (s) => ({
      value: s.id as string,
      label: s.title || "...",
   }));

   const p = (field: string) =>
      `steps.${index}.${field}` as Path<WorkflowEditFormValues>;

   return (
      <div
         className="rounded-lg border bg-white"
         data-testid={`step-edit-item-${index}`}
      >
         <div
            className="flex cursor-pointer items-center gap-2 px-4 py-3"
            onClick={() => setExpanded(!expanded)}
         >
            {expanded ? (
               <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            ) : (
               <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <span className="w-5 shrink-0 text-right font-mono text-xs text-muted-foreground">
               {index + 1}.
            </span>
            <span className="flex-1 truncate text-sm font-medium">
               {stepTitle || "Neuer Schritt"}
            </span>
            <Button
               type="button"
               variant="ghost"
               size="icon"
               className="h-7 w-7 shrink-0"
               onClick={(e) => {
                  e.stopPropagation();
                  removeStep(index);
               }}
               data-testid={`remove-step-${index}`}
            >
               <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
         </div>

         {expanded && (
            <>
               <Separator />
               <div className="space-y-4 px-4 pt-4 pb-4">
                  <FormInput<WorkflowEditFormValues>
                     name={p("title")}
                     label="Titel"
                     placeholder="Schritt Titel"
                     required
                     maxLength={250}
                     control={control}
                  />

                  <FormSelect<WorkflowEditFormValues>
                     name={p("type")}
                     label="Typ des Schritts"
                     placeholder="Typ auswählen"
                     options={[
                        { value: "PROMPT_REF", label: "Prompt" },
                        { value: "STANDALONE", label: "Eigenständig" },
                     ]}
                     control={control}
                  />

                  {stepType === "PROMPT_REF" && (
                     <FormSelectLoadableValues<WorkflowEditFormValues>
                        name={p("promptId")}
                        label="Prompt"
                        placeholder="Prompt suchen…"
                        required
                        control={control}
                        queryOptions={(search) =>
                           infiniteLoadPromptPreviewsPageOptions({
                              filters: { search },
                              sort: { field: "title", order: "asc" },
                           })
                        }
                     />
                  )}

                  {stepType === "STANDALONE" && (
                     <FormMDEditor<WorkflowEditFormValues>
                        name={p("content")}
                        placeholder="Text des Prompts"
                        control={control}
                     />
                  )}

                  <FormCheckBox<WorkflowEditFormValues>
                     name={p("isStart")}
                     label="Ist Startschritt"
                     control={control}
                  />

                  <FormTextArea<WorkflowEditFormValues>
                     name={p("hint")}
                     label="Hinweis"
                     placeholder="Kontext oder Anweisungen für den Nutzer im Runner"
                     maxLength={750}
                     rows={3}
                     control={control}
                  />

                  {stepId && (
                     <>
                        <Separator />
                        <div className="space-y-3">
                           <h4 className="text-sm font-semibold">
                              Nächste Schritte
                           </h4>

                           {edgeFields.length === 0 && (
                              <p className="text-sm text-muted-foreground">
                                 Keine Verbindungen — dieser Schritt beendet den
                                 Workflow.
                              </p>
                           )}

                           {edgeFields.map((edgeField, edgeIdx) => (
                              <div
                                 key={edgeField.id}
                                 className="flex items-end gap-2 rounded-md border p-3"
                              >
                                 <FormInput<WorkflowEditFormValues>
                                    name={
                                       p(
                                          `edges.${edgeIdx}.label`
                                       ) as Path<WorkflowEditFormValues>
                                    }
                                    label="Label"
                                    placeholder="z.B. Weiter"
                                    maxLength={250}
                                    className="flex-1"
                                    control={control}
                                 />

                                 <FormSelect<WorkflowEditFormValues>
                                    name={
                                       p(
                                          `edges.${edgeIdx}.toStepId`
                                       ) as Path<WorkflowEditFormValues>
                                    }
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
                                    className={cn(
                                       "shrink-0",
                                       edgeFields.length > 0 &&
                                          "mb-[22px] self-end"
                                    )}
                                    onClick={() => removeEdge(edgeIdx)}
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
                                 addEdge({
                                    toStepId: "",
                                    label: "",
                                    order: edgeFields.length,
                                 })
                              }
                              className="w-full"
                              data-testid={`add-edge-btn-${index}`}
                           >
                              <Plus className="mr-2 h-4 w-4" />
                              Verbindung hinzufügen
                           </Button>
                        </div>
                     </>
                  )}
               </div>
            </>
         )}
      </div>
   );
};

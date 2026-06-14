"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/shadcn/select";
import { Separator } from "@/components/shadcn/separator";
import { Textarea } from "@/components/shadcn/textarea";
import { MDEditor } from "@/components/shared/md";
import { getPromptTemplates } from "@/data/actions/prompt";
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

type FormValues = z.infer<typeof updateWorkflowStepSchema>;

type Props = {
   workflowId: string;
   step: DWorkflowStep | null;
   allSteps: DWorkflowStep[];
   onSaved: (workflow: DWorkflowWithSteps) => void;
   onCreateMode?: boolean;
   onCancelCreate?: () => void;
};

export const StepDetailPanel = ({
   workflowId,
   step,
   allSteps,
   onSaved,
   onCreateMode = false,
   onCancelCreate,
}: Props) => {
   const [loading, setLoading] = useState(false);
   const [templates, setTemplates] = useState<DPrompt[]>([]);

   useEffect(() => {
      getPromptTemplates().then(setTemplates).catch(console.error);
   }, []);

   const form = useForm<FormValues>({
      resolver: zodResolver(updateWorkflowStepSchema),
      defaultValues: step
         ? {
              title: step.title,
              hint: step.hint ?? "",
              type: step.type,
              promptId: step.promptId ?? "",
              content: step.content ?? "",
              isStart: step.isStart,
              position: step.position,
              edges: step.outgoingEdges.map((e) => ({
                 toStepId: e.toStepId,
                 label: e.label,
                 order: e.order,
              })),
           }
         : {
              title: "",
              hint: "",
              type: "PROMPT_REF",
              promptId: "",
              content: "",
              isStart: allSteps.length === 0,
              position: allSteps.length,
              edges: [],
           },
   });

   // Reset form when selected step changes
   useEffect(() => {
      if (step) {
         form.reset({
            title: step.title,
            hint: step.hint ?? "",
            type: step.type,
            promptId: step.promptId ?? "",
            content: step.content ?? "",
            isStart: step.isStart,
            position: step.position,
            edges: step.outgoingEdges.map((e) => ({
               toStepId: e.toStepId,
               label: e.label,
               order: e.order,
            })),
         });
      }
   }, [step, form]);

   const {
      fields: edgeFields,
      append,
      remove,
   } = useFieldArray({
      control: form.control,
      name: "edges",
   });

   const stepType = form.watch("type");

   const otherSteps = allSteps.filter((s) => s.id !== step?.id);

   const onSubmit = async (values: FormValues) => {
      setLoading(true);
      try {
         const payload = {
            ...values,
            promptId:
               values.type === "PROMPT_REF" ? values.promptId || null : null,
            content: values.type === "STANDALONE" ? values.content : null,
            hint: values.hint || null,
         };

         let result;
         if (step) {
            result = await updateWorkflowStep(step.id, workflowId, payload);
         } else {
            result = await createWorkflowStep(workflowId, payload);
         }

         if (result.success && result.data) {
            toast.success(result.message);
            onSaved(result.data);
            if (onCreateMode && onCancelCreate) {
               onCancelCreate();
            }
         } else {
            toast.error(result.message);
         }
      } finally {
         setLoading(false);
      }
   };

   return (
      <div
         className="flex h-full flex-col overflow-y-auto"
         data-testid="step-detail-panel"
      >
         <div className="border-b bg-white px-5 py-4">
            <h2 className="font-semibold text-slate-900">
               {onCreateMode ? "Neuer Schritt" : "Schritt bearbeiten"}
            </h2>
         </div>

         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="flex flex-1 flex-col gap-5 overflow-y-auto p-5"
            >
               {/* Titel */}
               <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Titel *</FormLabel>
                        <FormControl>
                           <Input
                              {...field}
                              placeholder="Schritt-Titel"
                              maxLength={250}
                              data-testid="step-title-input"
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               {/* Hinweis */}
               <FormField
                  control={form.control}
                  name="hint"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Hinweis (optional)</FormLabel>
                        <FormControl>
                           <Textarea
                              {...field}
                              value={field.value ?? ""}
                              placeholder="Kontext oder Anweisungen für den Nutzer im Runner"
                              maxLength={750}
                              rows={3}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               {/* Typ */}
               <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Typ</FormLabel>
                        <div className="flex gap-2">
                           <Button
                              type="button"
                              variant={
                                 field.value === "PROMPT_REF"
                                    ? "default"
                                    : "outline"
                              }
                              size="sm"
                              onClick={() => field.onChange("PROMPT_REF")}
                              data-testid="type-template-ref"
                           >
                              Template-Referenz
                           </Button>
                           <Button
                              type="button"
                              variant={
                                 field.value === "STANDALONE"
                                    ? "default"
                                    : "outline"
                              }
                              size="sm"
                              onClick={() => field.onChange("STANDALONE")}
                              data-testid="type-standalone"
                           >
                              Eigenständig
                           </Button>
                        </div>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               {/* Template-Picker */}
               {stepType === "PROMPT_REF" && (
                  <FormField
                     control={form.control}
                     name="promptId"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Template *</FormLabel>
                           <Select
                              value={field.value ?? ""}
                              onValueChange={field.onChange}
                           >
                              <FormControl>
                                 <SelectTrigger data-testid="template-select">
                                    <SelectValue placeholder="Template auswählen…" />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 {templates.map((t) => (
                                    <SelectItem key={t.id} value={t.id}>
                                       {t.title}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               )}

               {/* Standalone-Content */}
               {stepType === "STANDALONE" && (
                  <FormField
                     control={form.control}
                     name="content"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Prompt-Text *</FormLabel>
                           <FormControl>
                              <div className="min-h-50 rounded-md border">
                                 <MDEditor
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                 />
                              </div>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               )}

               {/* Ist Startschritt */}
               <FormField
                  control={form.control}
                  name="isStart"
                  render={({ field }) => (
                     <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                           <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="is-start-checkbox"
                           />
                        </FormControl>
                        <FormLabel className="cursor-pointer font-normal">
                           Ist Startschritt
                        </FormLabel>
                     </FormItem>
                  )}
               />

               <Separator />

               {/* Nächste Schritte / Edges */}
               <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Nächste Schritte</h3>

                  {edgeFields.length === 0 && (
                     <p className="text-sm text-muted-foreground">
                        Keine Verbindungen — dieser Schritt endet den Workflow.
                     </p>
                  )}

                  {edgeFields.map((edgeField, idx) => (
                     <div
                        key={edgeField.id}
                        className="flex items-start gap-2 rounded-md border p-3"
                     >
                        <div className="flex flex-1 flex-col gap-2">
                           <FormField
                              control={form.control}
                              name={`edges.${idx}.label`}
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel className="text-xs">
                                       Label
                                    </FormLabel>
                                    <FormControl>
                                       <Input
                                          {...field}
                                          placeholder="z.B. Weiter / Nochmal"
                                          maxLength={250}
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                           <FormField
                              control={form.control}
                              name={`edges.${idx}.toStepId`}
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel className="text-xs">
                                       Zielschritt
                                    </FormLabel>
                                    <Select
                                       value={field.value}
                                       onValueChange={field.onChange}
                                    >
                                       <FormControl>
                                          <SelectTrigger>
                                             <SelectValue placeholder="Schritt auswählen…" />
                                          </SelectTrigger>
                                       </FormControl>
                                       <SelectContent>
                                          {otherSteps.map((s) => (
                                             <SelectItem
                                                key={s.id}
                                                value={s.id}
                                             >
                                                {s.title}
                                             </SelectItem>
                                          ))}
                                       </SelectContent>
                                    </Select>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </div>
                        <Button
                           type="button"
                           variant="ghost"
                           size="icon"
                           className="mt-6 shrink-0"
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

               {/* Form error from edges */}
               {form.formState.errors.edges?.message && (
                  <p className="text-sm text-destructive">
                     {form.formState.errors.edges.message}
                  </p>
               )}

               <div className="flex justify-end gap-2">
                  {onCreateMode && onCancelCreate && (
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
                     Schritt speichern
                  </Button>
               </div>
            </form>
         </Form>
      </div>
   );
};

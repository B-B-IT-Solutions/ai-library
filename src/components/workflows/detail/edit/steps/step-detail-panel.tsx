"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronDown, ChevronsUpDown, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from "@/components/shadcn/command";
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
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/shadcn/popover";
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
import { cn } from "@/lib/utils";
import { initWorkflowStep } from "../utils";

type FormValues = z.infer<typeof updateWorkflowStepSchema>;

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
   const [loading, setLoading] = useState(false);
   const [templates, setTemplates] = useState<DPrompt[]>([]);
   const [templateOpen, setTemplateOpen] = useState(false);
   const [showHint, setShowHint] = useState(() => !!step?.hint);

   useEffect(() => {
      getPromptTemplates().then(setTemplates).catch(console.error);
   }, []);

   const form = useForm<FormValues>({
      resolver: zodResolver(updateWorkflowStepSchema),
      defaultValues: initWorkflowStep(step),
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
         setShowHint(!!step.hint);
      }
   }, [step, form]);

   // Propagate dirty state to parent
   const onDirtyChangeRef = useRef(onDirtyChange);
   onDirtyChangeRef.current = onDirtyChange;
   const isDirty = form.formState.isDirty;
   useEffect(() => {
      onDirtyChangeRef.current?.(isDirty);
   }, [isDirty]);

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

   const headerTitle = onCreateMode
      ? "Neuer Schritt"
      : step?.title
        ? `Schritt bearbeiten`
        : "Schritt bearbeiten";

   return (
      <div
         className="flex h-full flex-col overflow-y-auto"
         data-testid="step-detail-panel"
      >
         <div className="shrink-0 border-b bg-white px-5 py-4">
            <div className="flex items-center gap-2">
               <h2 className="font-semibold text-slate-900">{headerTitle}</h2>
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

               {/* Template-Picker als Combobox */}
               {stepType === "PROMPT_REF" && (
                  <FormField
                     control={form.control}
                     name="promptId"
                     render={({ field }) => {
                        const selected = templates.find(
                           (t) => t.id === field.value
                        );
                        return (
                           <FormItem>
                              <FormLabel>Template *</FormLabel>
                              <Popover
                                 open={templateOpen}
                                 onOpenChange={setTemplateOpen}
                              >
                                 <PopoverTrigger asChild>
                                    <FormControl>
                                       <Button
                                          variant="outline"
                                          role="combobox"
                                          aria-expanded={templateOpen}
                                          className="w-full justify-between font-normal"
                                          data-testid="template-select"
                                       >
                                          <span className="truncate">
                                             {selected
                                                ? selected.title
                                                : "Template auswählen…"}
                                          </span>
                                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                       </Button>
                                    </FormControl>
                                 </PopoverTrigger>
                                 <PopoverContent
                                    className="p-0"
                                    align="start"
                                    style={{
                                       width: "var(--radix-popover-trigger-width)",
                                    }}
                                 >
                                    <Command>
                                       <CommandInput placeholder="Template suchen…" />
                                       <CommandList>
                                          <CommandEmpty>
                                             Kein Template gefunden.
                                          </CommandEmpty>
                                          <CommandGroup>
                                             {templates.map((t) => (
                                                <CommandItem
                                                   key={t.id}
                                                   value={t.title}
                                                   onSelect={() => {
                                                      field.onChange(t.id);
                                                      setTemplateOpen(false);
                                                   }}
                                                >
                                                   <Check
                                                      className={cn(
                                                         "mr-2 h-4 w-4",
                                                         field.value === t.id
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                      )}
                                                   />
                                                   {t.title}
                                                </CommandItem>
                                             ))}
                                          </CommandGroup>
                                       </CommandList>
                                    </Command>
                                 </PopoverContent>
                              </Popover>
                              <FormMessage />
                           </FormItem>
                        );
                     }}
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

               {/* Hinweis — collapsible */}
               <div>
                  <button
                     type="button"
                     className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
                     onClick={() => setShowHint((v) => !v)}
                  >
                     <ChevronDown
                        className={cn(
                           "h-4 w-4 transition-transform duration-150",
                           showHint && "rotate-180"
                        )}
                     />
                     Hinweis (optional)
                  </button>
                  {showHint && (
                     <FormField
                        control={form.control}
                        name="hint"
                        render={({ field }) => (
                           <FormItem className="mt-2">
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
                  )}
               </div>

               <Separator />

               {/* Nächste Schritte / Edges */}
               <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Nächste Schritte</h3>

                  {edgeFields.length === 0 && (
                     <p className="text-sm text-muted-foreground">
                        Keine Verbindungen — dieser Schritt beendet den
                        Workflow.
                     </p>
                  )}

                  {edgeFields.map((edgeField, idx) => (
                     <div
                        key={edgeField.id}
                        className="flex items-end gap-2 rounded-md border p-3"
                     >
                        <FormField
                           control={form.control}
                           name={`edges.${idx}.label`}
                           render={({ field }) => (
                              <FormItem className="flex-1">
                                 <FormLabel className="text-xs">
                                    Label
                                 </FormLabel>
                                 <FormControl>
                                    <Input
                                       {...field}
                                       placeholder="z.B. Weiter"
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
                              <FormItem className="flex-1">
                                 <FormLabel className="text-xs">
                                    Zielschritt
                                 </FormLabel>
                                 <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                 >
                                    <FormControl>
                                       <SelectTrigger>
                                          <SelectValue placeholder="Schritt…" />
                                       </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                       {otherSteps.map((s) => (
                                          <SelectItem key={s.id} value={s.id}>
                                             {s.title}
                                          </SelectItem>
                                       ))}
                                    </SelectContent>
                                 </Select>
                                 <FormMessage />
                              </FormItem>
                           )}
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

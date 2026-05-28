"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { filter, includes, upperFirst } from "es-toolkit/compat";
import { AlertCircle, Maximize2, Minimize2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { Form } from "@/components/shadcn/form";
import {
   Tabs,
   TabsContent,
   TabsList,
   TabsTrigger,
} from "@/components/shadcn/tabs";
import { newTemplateFieldInitValues } from "@/components/shared/template-fields";
import { createPrompt, updatePrompt } from "@/data/actions/prompt";
import {
   DPromptUpdate,
   DPromptUpdateCrate,
   DPromptVariable,
   DPromptWithContent,
} from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import { updateTemplateSchema } from "@/data/types/validators/template";

import {
   BasicInfo,
   DetectedVariables,
   PromptContent,
   PromptVariables,
} from "./sections";
import {
   extractVariablesFromContent,
   getVariableStatus,
   initPromptTemplate,
} from "./utils";

type Props = {
   prompt?: DPromptWithContent;
   collectionId?: string;
   globalFields: DGlobalPromptField[];
   onSubmit: (isSubmiting: boolean) => void;
};

export const PromptEditForm = ({
   prompt,
   collectionId,
   globalFields,
   onSubmit: onSubmittingChange,
}: Props) => {
   const router = useRouter();
   const isEdit = !!prompt;

   const form = useForm<DPromptUpdate>({
      resolver: zodResolver(updateTemplateSchema),
      defaultValues: initPromptTemplate(prompt),
      mode: "onBlur",
   });

   const {
      fields,
      append: addField,
      remove: removeField,
   } = useFieldArray({
      control: form.control,
      name: "fields",
   });

   const { isSubmitting, errors } = form.formState;
   const hasFieldErrors = !!errors.fields?.some(Boolean);
   const [isEditorExpanded, setIsEditorExpanded] = useState(false);

   useEffect(() => {
      onSubmittingChange?.(isSubmitting);
   }, [isSubmitting, onSubmittingChange]);

   const content = form.watch("content");
   const globalFieldIds = form.watch("globalFieldIds");
   const watchedFields = form.watch("fields");

   const detectedVariables = useMemo(
      () => extractVariablesFromContent(content || ""),
      [content]
   );

   const variableStatus = useMemo(() => {
      const templateFieldNames = watchedFields.map((f) => f.name);
      const globalFieldNames = globalFields
         .filter((gf) => includes(globalFieldIds, gf.id))
         .map((gf) => gf.name);

      const allFieldNames = [...templateFieldNames, ...globalFieldNames];
      return getVariableStatus(detectedVariables, allFieldNames);
   }, [detectedVariables, watchedFields, globalFields, globalFieldIds]);

   const handleAddField = () => {
      const order = fields.length;
      addField(newTemplateFieldInitValues(order));
   };

   const handleAddVariableAsField = (variableName: string) => {
      const order = fields.length;
      const label = upperFirst(variableName);
      addField(newTemplateFieldInitValues(order, variableName, label));
      toast.success(`Feld "${variableName}" hinzugefügt`);
   };

   const handleSyncAllVariables = () => {
      let addedCount = 0;
      variableStatus.undefined.forEach((varName) => {
         handleAddVariableAsField(varName);
         addedCount++;
      });
      toast.success(`${addedCount} Feld(er) synchronisiert`);
   };

   const handleAddGlobalFieldIds = (newIds: string[]) => {
      const current = form.getValues("globalFieldIds");
      form.setValue("globalFieldIds", [...current, ...newIds]);
      toast.success(`${newIds.length} globale Feld(er) hinzugefügt`);
   };

   const handleRemoveGlobalFieldId = (id: string) => {
      const current = form.getValues("globalFieldIds");
      form.setValue(
         "globalFieldIds",
         filter(current, (i) => i !== id)
      );
   };

   const onSubmit: SubmitHandler<DPromptUpdate> = async (data) => {
      if (isEdit) {
         const result = await updatePrompt(prompt.id, data);
         if (result.success) {
            toast.success(result.message);
            router.push(`/templates/${prompt.id}`);
         } else {
            toast.error(result.message);
         }
      } else {
         const crate: DPromptUpdateCrate = {
            data,
            collectionId,
         };
         const result = await createPrompt(crate);
         if (result.success) {
            toast.success(result.message);
            if (collectionId) {
               router.push(`/collections/${collectionId}`);
            } else {
               router.push(`/templates/${result.data!.id}`);
            }
         } else if (result.upgradeRequired) {
            toast.error(result.message, {
               action: {
                  label: "Upgrade",
                  onClick: () => router.push("/subscription/pricing"),
               },
            });
         } else {
            toast.error(result.message);
         }
      }
   };

   return (
      <div data-testid="prompt-edit-form" className="space-y-4">
         <Form {...form}>
            <form
               id="prompt-edit-form"
               onSubmit={form.handleSubmit(onSubmit)}
               className="space-y-4"
            >
               {!isEditorExpanded && (
                  <div className="rounded-xl bg-white p-6 shadow-sm">
                     <BasicInfo control={form.control} />
                  </div>
               )}
               <div className="rounded-xl bg-white p-6 shadow-sm">
                  <Tabs defaultValue="editor" data-testid="tabs">
                     <div className="mb-2 flex items-center justify-between">
                        <TabsList>
                           <TabsTrigger
                              value="editor"
                              data-testid="editor-tab-trigger"
                           >
                              Prompt
                           </TabsTrigger>
                           <TabsTrigger
                              value="variables"
                              data-testid="variables-tab-trigger"
                           >
                              Platzhalter
                              {hasFieldErrors ? (
                                 <AlertCircle className="ml-1.5 h-3.5 w-3.5 text-red-500" />
                              ) : fields.length > 0 && (
                                 <span className="ml-1.5 rounded-full bg-indigo-100 px-1.5 py-0.5 text-xs font-medium text-indigo-700">
                                    {fields.length}
                                 </span>
                              )}
                           </TabsTrigger>
                        </TabsList>
                        <Button
                           type="button"
                           variant="ghost"
                           size="sm"
                           onClick={() => setIsEditorExpanded((v) => !v)}
                           className="cursor-pointer text-slate-500 hover:text-slate-900"
                           title={
                              isEditorExpanded ? "Verkleinern" : "Vergrößern"
                           }
                           data-testid="expand-editor-btn"
                        >
                           {isEditorExpanded ? (
                              <Minimize2 className="h-4 w-4" />
                           ) : (
                              <Maximize2 className="h-4 w-4" />
                           )}
                        </Button>
                     </div>
                     <TabsContent value="editor">
                        <PromptContent control={form.control} />
                     </TabsContent>
                     <TabsContent value="variables" className="space-y-8">
                        <DetectedVariables
                           detectedVariables={detectedVariables}
                           variableStatus={variableStatus}
                           onAddVariable={handleAddVariableAsField}
                           onSyncAll={handleSyncAllVariables}
                        />
                        <PromptVariables
                           fields={fields as DPromptVariable[]}
                           detectedVariables={detectedVariables}
                           globalFields={globalFields}
                           globalFieldIds={form.watch("globalFieldIds")}
                           onAddField={handleAddField}
                           onRemoveField={removeField}
                           onAddGlobalFieldIds={handleAddGlobalFieldIds}
                           onRemoveGlobalFieldId={handleRemoveGlobalFieldId}
                           control={form.control}
                           watch={form.watch}
                        />
                     </TabsContent>
                  </Tabs>
               </div>
            </form>
         </Form>
      </div>
   );
};

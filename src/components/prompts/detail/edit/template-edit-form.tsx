"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { filter, includes, upperFirst } from "es-toolkit/compat";
import { Loader, Maximize2, Minimize2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent } from "@/components/shadcn/card";
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
   PromptTemplateContent,
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
   onSubmittingChange?: (isSubmitting: boolean) => void;
};

export const TemplateEditForm = ({
   prompt,
   collectionId,
   globalFields,
   onSubmittingChange,
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

   const { isSubmitting } = form.formState;
   const [isEditorExpanded, setIsEditorExpanded] = useState(false);

   useEffect(() => {
      onSubmittingChange?.(isSubmitting);
   }, [isSubmitting, onSubmittingChange]);

   const content = form.watch("content");
   const globalFieldIds = form.watch("globalFieldIds");

   const detectedVariables = useMemo(
      () => extractVariablesFromContent(content || ""),
      [content]
   );

   const variableStatus = useMemo(() => {
      const templateFieldNames = fields.map((f) =>
         form.getValues(`fields.${fields.indexOf(f)}.name`)
      );
      const globalFieldNames = globalFields
         .filter((gf) => includes(globalFieldIds, gf.id))
         .map((gf) => gf.name);

      const allFieldNames = [...templateFieldNames, ...globalFieldNames];
      return getVariableStatus(detectedVariables, allFieldNames);
   }, [detectedVariables, fields, form, globalFields, globalFieldIds]);

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

   const cancelHref = isEdit
      ? `/templates/${prompt!.id}`
      : collectionId
        ? `/collections/${collectionId}`
        : "/templates";

   const cancelBtn = () => {
      return (
         <Button
            asChild={true}
            type="button"
            variant="outline"
            disabled={isSubmitting}
            className="cursor-pointer"
            data-testid="cancel-btn"
         >
            <Link href={cancelHref}>Abbrechen</Link>
         </Button>
      );
   };

   const submitBtn = () => {
      return (
         <Button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer"
            data-testid="save-btn"
         >
            {isSubmitting ? (
               <>
                  <Loader className="h-4 w-4 animate-spin" />
                  {isEdit ? "Wird gespeichert..." : "Wird erstellt..."}
               </>
            ) : (
               <>{isEdit ? "Prompt speichern" : "Prompt erstellen"}</>
            )}
         </Button>
      );
   };

   return (
      <div data-testid="template-edit-form" className="space-y-4">
         <Form {...form}>
            <form
               id="template-edit-form"
               onSubmit={form.handleSubmit(onSubmit)}
               className="space-y-4"
            >
               {!isEditorExpanded && (
                  <Card>
                     <CardContent className="p-6">
                        <BasicInfo control={form.control} />
                     </CardContent>
                  </Card>
               )}
               <Card>
                  <CardContent className="p-6">
                     <Tabs defaultValue="editor">
                        <div className="mb-4 flex items-center justify-between">
                           <TabsList>
                              <TabsTrigger value="editor">
                                 Prompt-Editor
                              </TabsTrigger>
                              <TabsTrigger value="fields">
                                 Vorlagen-Felder
                                 {fields.length > 0 && (
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
                              title={isEditorExpanded ? "Verkleinern" : "Vergrößern"}
                           >
                              {isEditorExpanded ? (
                                 <Minimize2 className="h-4 w-4" />
                              ) : (
                                 <Maximize2 className="h-4 w-4" />
                              )}
                           </Button>
                        </div>
                        <TabsContent value="editor" className="space-y-6">
                           <PromptTemplateContent control={form.control} />
                           <DetectedVariables
                              detectedVariables={detectedVariables}
                              variableStatus={variableStatus}
                              onAddVariable={handleAddVariableAsField}
                              onSyncAll={handleSyncAllVariables}
                           />
                        </TabsContent>
                        <TabsContent value="fields">
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
                  </CardContent>
               </Card>
               {/* Mobile-only action buttons (desktop uses sticky header) */}
               <div className="flex items-center justify-end gap-3 lg:hidden">
                  {cancelBtn()}
                  {submitBtn()}
               </div>
            </form>
         </Form>
      </div>
   );
};

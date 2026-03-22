"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { filter, includes, upperFirst } from "es-toolkit/compat";
import { Loader, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
} from "@/components/shadcn/card";
import { Form } from "@/components/shadcn/form";
import { Separator } from "@/components/shadcn/separator";
import { newTemplateFieldInitValues } from "@/components/shared/template-fields";
import { createLibraryEntry, updateLibraryEntry } from "@/data/actions/library";
import { DLibraryEntryWithPromptTemplate } from "@/data/types/domain/library";
import {
   DPromptTemplateField,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";
import { DGlobalTemplateField } from "@/data/types/domain/settings";
import { updatePromptTemplateSchema } from "@/data/types/validators/prompt";

import {
   BasicInfo,
   DetectedVariables,
   PromptTemplateContent,
   PromptTemplateFields,
} from "./sections";
import {
   extractVariablesFromContent,
   getVariableStatus,
   initPromptTempalte,
} from "./utils";

type Props = {
   entry?: DLibraryEntryWithPromptTemplate;
   globalFields: DGlobalTemplateField[];
};

export const LibraryEntryEditForm = ({ entry, globalFields }: Props) => {
   const router = useRouter();
   const isEdit = !!entry;

   const form = useForm<DPromptTemplateUpdate>({
      resolver: zodResolver(updatePromptTemplateSchema),
      defaultValues: initPromptTempalte(entry),
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

   const onSubmit: SubmitHandler<DPromptTemplateUpdate> = async (data) => {
      if (isEdit) {
         const result = await updateLibraryEntry(entry.id, data);
         if (result.success) {
            toast.success(result.message);
            router.push(`/library/${entry.id}`);
         } else {
            toast.error(result.message);
         }
      } else {
         const result = await createLibraryEntry(data);
         if (result.success) {
            toast.success(result.message);
            router.push("/library");
         } else {
            toast.error(result.message);
         }
      }
   };

   const cancelBtn = () => {
      return (
         <Link href={isEdit ? `/library/${entry.id}` : "/library"}>
            <Button
               type="button"
               variant="outline"
               disabled={isSubmitting}
               className="cursor-pointer"
               data-testid="cancel-btn"
            >
               Abbrechen
            </Button>
         </Link>
      );
   };

   const submitBtn = () => {
      return (
         <Button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer"
            data-testid={"save-btn"}
         >
            {isSubmitting ? (
               <>
                  <Loader className="h-4 w-4 animate-spin" />
                  {isEdit ? "Wird gespeichert..." : "Wird erstellt..."}
               </>
            ) : (
               <>
                  <Save className="h-4 w-4" />
                  {isEdit ? "Vorlage speichern" : "Vorlage erstellen"}
               </>
            )}
         </Button>
      );
   };

   const buttons = () => {
      return (
         <div className="flex items-center justify-end gap-3 pt-2">
            {cancelBtn()}
            {submitBtn()}
         </div>
      );
   };

   return (
      <Card data-testid="library-entry-edit-form">
         <CardHeader className="border-b pb-6">
            <CardTitle className="text-2xl font-bold text-slate-900">
               {isEdit ? "Vorlage bearbeiten" : "Neue Vorlage erstellen"}
            </CardTitle>
            {isEdit && (
               <p className="mt-0.5 text-sm text-slate-600">
                  {entry.templateDescriptor.title}
               </p>
            )}
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
               >
                  <BasicInfo
                     control={form.control}
                  />
                  <Separator />
                  <PromptTemplateContent control={form.control} />
                  <Separator />
                  <DetectedVariables
                     detectedVariables={detectedVariables}
                     variableStatus={variableStatus}
                     onAddVariable={handleAddVariableAsField}
                     onSyncAll={handleSyncAllVariables}
                  />
                  {detectedVariables.length > 0 && <Separator />}
                  <PromptTemplateFields
                     fields={fields as DPromptTemplateField[]}
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
                  <Separator />
                  {buttons()}
               </form>
            </Form>
         </CardContent>
      </Card>
   );
};

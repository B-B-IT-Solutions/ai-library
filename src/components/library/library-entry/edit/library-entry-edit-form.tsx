"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { upperFirst } from "es-toolkit/compat";
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
import { createLibraryEntry, updateLibraryEntry } from "@/data/actions/library";
import { DGlobalField } from "@/data/types/domain/global-field";
import { DLibraryEntryWithPromptTemplate } from "@/data/types/domain/library";
import {
   DPromptTemplateField,
   DPromptTemplateFieldUpdate,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";
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
   initPromptTemplateField,
} from "./utils";

type Props = {
   entry?: DLibraryEntryWithPromptTemplate;
   globalFields?: DGlobalField[];
};

export const LibraryEntryEditForm = ({ entry, globalFields = [] }: Props) => {
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

   const detectedVariables = useMemo(
      () => extractVariablesFromContent(content || ""),
      [content]
   );

   const variableStatus = useMemo(() => {
      const fieldNames = fields.map((f) =>
         form.getValues(`fields.${fields.indexOf(f)}.name`)
      );
      return getVariableStatus(detectedVariables, fieldNames);
   }, [detectedVariables, fields, form]);

   const handleAddField = () => {
      const order = fields.length;
      addField(initPromptTemplateField(order));
   };

   const handleAddVariableAsField = (variableName: string) => {
      const order = fields.length;
      const label = upperFirst(variableName);
      addField(initPromptTemplateField(order, variableName, label));
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

   const handleAddGlobalFields = (gFields: DPromptTemplateFieldUpdate[]) => {
      const currentCount = fields.length;
      gFields.forEach((f, idx) => {
         addField({ ...f, order: currentCount + idx });
      });
      toast.success(`${gFields.length} Feld(er) aus Bibliothek hinzugefügt`);
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

   const createBtn = () => {
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
            {createBtn()}
         </div>
      );
   };

   return (
      <Card data-testid="library-entry-edit-form">
         <CardHeader className="border-b pb-6">
            <CardTitle className="text-2xl font-bold text-slate-900">
               {isEdit ? "Vorlage bearbeiten" : "Neue Vorlage erstellen"}
            </CardTitle>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
               >
                  <BasicInfo
                     control={form.control}
                     watch={form.watch}
                     setValue={form.setValue}
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
                     onAddField={handleAddField}
                     onAddGlobalFields={handleAddGlobalFields}
                     onRemoveField={removeField}
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

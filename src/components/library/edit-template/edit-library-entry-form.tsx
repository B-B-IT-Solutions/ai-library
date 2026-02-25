"use client";

import { FC, useMemo } from "react";
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
import { updateLibraryEntry } from "@/data/actions/library";
import { DLibraryEntryWithPromptTemplate } from "@/data/types/domain/library";
import {
   DPromptTemplateField,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";
import { updatePromptTemplateSchema } from "@/data/types/validators/prompt";
import { initPromptTemplateField } from "../utils";

import {
   BasicInfo,
   DetectedVariables,
   PromptTemplateContent,
   PromptTemplateFields,
} from "./sections";
import { extractVariablesFromContent, getVariableStatus } from "./utils";

type Props = {
   entry: DLibraryEntryWithPromptTemplate;
};

const initFromEntry = (
   entry: DLibraryEntryWithPromptTemplate
): DPromptTemplateUpdate => {
   const { templateDescriptor: descriptor } = entry;
   return {
      title: descriptor.title,
      description: descriptor.description,
      content: descriptor.promptTemplate.content,
      detailedDescription: descriptor.promptTemplate.detailedDescription,
      recommendedModel: descriptor.recommendedModel,
      categories: descriptor.categories.map((c) => c.name),
      categoryInput: "",
      fields: descriptor.promptTemplate.fields.map((f) => ({
         name: f.name,
         label: f.label,
         description: f.description ?? "",
         type: f.type,
         required: f.required,
         order: f.order,
         defaultValue: f.defaultValue ?? "",
         options: f.options ?? [],
      })),
   };
};

export const EditLibraryEntryForm: FC<Props> = ({ entry }) => {
   const router = useRouter();

   const form = useForm<DPromptTemplateUpdate>({
      resolver: zodResolver(updatePromptTemplateSchema),
      defaultValues: initFromEntry(entry),
   });

   const {
      fields,
      append: addField,
      remove: removeField,
   } = useFieldArray({
      control: form.control,
      name: "fields",
   });

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

   const onSubmit: SubmitHandler<DPromptTemplateUpdate> = async (data) => {
      const result = await updateLibraryEntry(entry.id, data);

      if (result.success) {
         toast.success(result.message);
         router.push(`/library/${entry.id}`);
      } else {
         toast.error(result.message);
      }
   };

   const cancelBtn = () => (
      <Link href={`/library/${entry.id}`}>
         <Button
            type="button"
            variant="outline"
            disabled={form.formState.isSubmitting}
            className="cursor-pointer"
            data-testid="cancel-btn"
         >
            Abbrechen
         </Button>
      </Link>
   );

   const saveBtn = () => {
      const { isSubmitting } = form.formState;
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
                  Wird gespeichert...
               </>
            ) : (
               <>
                  <Save className="h-4 w-4" />
                  Vorlage speichern
               </>
            )}
         </Button>
      );
   };

   return (
      <Card data-testid="edit-library-entry-form">
         <CardHeader className="border-b pb-6">
            <CardTitle className="text-2xl font-bold text-slate-900">
               Vorlage bearbeiten
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
                     onAddField={handleAddField}
                     onRemoveField={removeField}
                     control={form.control}
                     watch={form.watch}
                  />

                  <Separator />

                  <div className="flex items-center justify-end gap-3 pt-2">
                     {cancelBtn()}
                     {saveBtn()}
                  </div>
               </form>
            </Form>
         </CardContent>
      </Card>
   );
};

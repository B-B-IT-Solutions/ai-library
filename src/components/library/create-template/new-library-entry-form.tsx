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
import { createCustomTemplate } from "@/data/actions/library";
import {
   DPromptTemplateField,
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

export const NewLibraryEntryForm: FC = () => {
   const router = useRouter();

   const form = useForm<DPromptTemplateUpdate>({
      resolver: zodResolver(updatePromptTemplateSchema),
      defaultValues: initPromptTempalte(),
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

   // Extract variables from content
   const detectedVariables = useMemo(
      () => extractVariablesFromContent(content || ""),
      [content]
   );

   // Determine variable status
   const variableStatus = useMemo(() => {
      const fieldNames = fields.map((f) =>
         form.getValues(`fields.${fields.indexOf(f)}.name`)
      );
      return getVariableStatus(detectedVariables, fieldNames);
   }, [detectedVariables, fields, form]);

   const handleAddField = () => {
      const order = fields.length;
      const initValue = initPromptTemplateField(order);
      addField(initValue);
   };

   const handleAddVariableAsField = (variableName: string) => {
      const order = fields.length;
      const name = variableName;
      const label = upperFirst(variableName);
      const initValue = initPromptTemplateField(order, name, label);
      addField(initValue);
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
      const result = await createCustomTemplate({
         title: data.title,
         description: data.description,
         content: data.content,
         detailedDescription: data.detailedDescription,
         recommendedModel: data.recommendedModel,
         categories: data.categories,
         fields: data.fields,
      });

      if (result.success) {
         toast.success(result.message);
         router.push("/library");
      } else {
         toast.error(result.message);
      }
   };

   const cancelBtn = () => {
      return (
         <Link href="/library">
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
   };

   const createBtn = () => {
      const { isSubmitting } = form.formState;
      return (
         <Button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer"
            data-testid="create-btn"
         >
            {isSubmitting ? (
               <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Wird erstellt...
               </>
            ) : (
               <>
                  <Save className="h-4 w-4" />
                  Vorlage erstellen
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
      <Card data-testid="new-library-entry-form">
         <CardHeader className="border-b pb-6">
            <CardTitle className="text-2xl font-bold text-slate-900">
               Neue Vorlage erstellen
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

                  {buttons()}
               </form>
            </Form>
         </CardContent>
      </Card>
   );
};

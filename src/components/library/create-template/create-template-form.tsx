"use client";

import { FC, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
   BasicInformationSection,
   DetectedVariablesSection,
   PromptTemplateSection,
   TemplateFieldsSection,
} from "./sections";
import {
   capitalizeFirstLetter,
   extractVariablesFromContent,
   getVariableStatus,
} from "./utils";

const templateFieldSchema = z.object({
   name: z.string().min(1, "Feldname ist erforderlich"),
   label: z.string().min(1, "Label ist erforderlich"),
   description: z.string().optional(),
   type: z.string(),
   required: z.boolean(),
   order: z.number(),
   defaultValue: z.string().optional(),
   options: z.array(z.string()).optional(),
});

const createTemplateSchema = z.object({
   title: z.string().min(1, "Titel ist erforderlich"),
   description: z.string().min(1, "Beschreibung ist erforderlich"),
   detailedDescription: z
      .string()
      .min(1, "Detaillierte Beschreibung ist erforderlich"),
   content: z.string().min(1, "Prompt-Vorlage ist erforderlich"),
   recommendedModel: z.string().min(1, "Modell ist erforderlich"),
   categories: z.array(z.string()),
   categoryInput: z.string().optional(),
   fields: z.array(templateFieldSchema),
});

type FormData = z.infer<typeof createTemplateSchema>;

export const CreateTemplateForm: FC = () => {
   const router = useRouter();

   const form = useForm<FormData>({
      resolver: zodResolver(createTemplateSchema),
      defaultValues: {
         title: "",
         description: "",
         content: "",
         detailedDescription: "",
         recommendedModel: "Claude 3.5 Sonnet",
         categories: [],
         categoryInput: "",
         fields: [],
      },
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
      addField({
         name: "",
         label: "",
         description: "",
         type: "TEXT",
         required: true,
         order: fields.length,
         defaultValue: "",
         options: [],
      });
   };

   const handleAddVariableAsField = (variableName: string) => {
      addField({
         name: variableName,
         label: capitalizeFirstLetter(variableName),
         description: "",
         type: "TEXT",
         required: true,
         order: fields.length,
         defaultValue: "",
         options: [],
      });
      toast.success(`Feld "${variableName}" hinzugefügt`);
   };

   const handleSyncAllVariables = () => {
      let addedCount = 0;
      variableStatus.undefined.forEach((varName) => {
         handleAddVariableAsField(varName);
         addedCount++;
      });

      if (addedCount > 0) {
         toast.success(`${addedCount} Feld(er) synchronisiert`);
      } else {
         toast.info("Alle Variablen sind bereits definiert");
      }
   };

   const onSubmit: SubmitHandler<FormData> = async (data) => {
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
         router.refresh();
      } else {
         toast.error(result.message);
      }
   };

   return (
      <Card data-testid="create-template-form">
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
                  data-testid="template-form"
               >
                  <BasicInformationSection
                     control={form.control}
                     watch={form.watch}
                     setValue={form.setValue}
                  />

                  <Separator />

                  <PromptTemplateSection control={form.control} />

                  <Separator />

                  <DetectedVariablesSection
                     detectedVariables={detectedVariables}
                     variableStatus={variableStatus}
                     onAddVariable={handleAddVariableAsField}
                     onSyncAll={handleSyncAllVariables}
                  />

                  {detectedVariables.length > 0 && <Separator />}

                  <TemplateFieldsSection
                     control={form.control}
                     watch={form.watch}
                     fields={fields}
                     detectedVariables={detectedVariables}
                     onAddField={handleAddField}
                     onRemoveField={removeField}
                  />

                  <Separator />

                  <div className="flex items-center justify-end gap-3 pt-2">
                     <Link href="/library">
                        <Button
                           type="button"
                           variant="outline"
                           disabled={form.formState.isSubmitting}
                           data-testid="cancel-btn"
                        >
                           Abbrechen
                        </Button>
                     </Link>
                     <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        data-testid="create-btn"
                     >
                        {form.formState.isSubmitting ? (
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
                  </div>
               </form>
            </Form>
         </CardContent>
      </Card>
   );
};

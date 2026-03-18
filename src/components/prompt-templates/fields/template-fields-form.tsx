"use client";

import { FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { map, reduce } from "es-toolkit/compat";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/shadcn/button";
import { Form } from "@/components/shadcn/form";
import { CallbackFn } from "@/data/types/common";
import {
   DPromptTemplateDataPromptGeneration,
   DPromptTemplateField,
   DPromptTemplateFieldValues,
} from "@/data/types/domain/prompt.template";

import { CheckBoxField } from "./field/field-check-box";
import { GenericField } from "./field/field-generic";
import { RadioField } from "./field/field-radio";
import { SelectField } from "./field/field-select";
import { TextAreaField } from "./field/field-textarea";
import { buildFieldsSchema } from "./fields.schema";
import { TemplatePreview } from "./template-preview";

type Props = {
   templateData: DPromptTemplateDataPromptGeneration;
   onSubmit: (values: DPromptTemplateFieldValues) => void;
   onCancel: CallbackFn;
};

export const TemplateFieldForm: FC<Props> = ({
   templateData,
   onSubmit,
   onCancel,
}) => {
   const { template, allFields: fields } = templateData;

   const fieldsSchema = buildFieldsSchema(fields);

   type DFieldsType = z.infer<typeof fieldsSchema>;

   const form = useForm<DFieldsType>({
      resolver: zodResolver(fieldsSchema),
      defaultValues: reduce(
         fields,
         (acc, field) => ({
            ...acc,
            [field.name]:
               field.defaultValue ?? (field.type === "CHECKBOX" ? false : ""),
         }),
         {}
      ),
   });

   const currentValues = useWatch<DFieldsType>({
      control: form.control,
   }) as DPromptTemplateFieldValues;

   const renderField = (field: DPromptTemplateField) => {
      switch (field.type) {
         case "TEXTAREA":
            return <TextAreaField field={field} control={form.control} />;
         case "SELECT":
            return <SelectField field={field} control={form.control} />;
         case "RADIO":
            return <RadioField field={field} control={form.control} />;
         case "CHECKBOX":
            return <CheckBoxField field={field} control={form.control} />;
         case "NUMBER":
         case "DATE":
         case "EMAIL":
         case "TEXT":
            return <GenericField field={field} control={form.control} />;
      }
   };

   const renderFields = () => {
      return map(fields, (field) => {
         return <div key={field.id}>{renderField(field)}</div>;
      });
   };

   const onSubmitInternal: SubmitHandler<DFieldsType> = (data) => {
      onSubmit(data as DPromptTemplateFieldValues);
   };

   const preview = () => {
      return (
         <div className="flex flex-col gap-2">
            <div className="max-h-[65vh] flex-1 overflow-y-auto rounded-md border bg-muted/30 p-4">
               <TemplatePreview template={template} values={currentValues} />
            </div>
            <p className="text-xs text-muted-foreground">
               <span className="mr-1 inline-block rounded bg-orange-100 px-1 text-orange-700 italic">
                  {"{{platzhalter}}"}
               </span>
               noch nicht ausgefüllt ·{" "}
               <span className="mr-1 inline-block rounded bg-green-100 px-1 font-medium text-green-800">
                  wert
               </span>
               ausgefüllt
            </p>
         </div>
      );
   };

   const fieldInputs = () => (
      <div className="flex flex-col justify-between">
         <div className="space-y-4">{renderFields()}</div>
         <div className="flex justify-end gap-2 pt-2">
            <Button
               type="button"
               variant="outline"
               onClick={onCancel}
               className="cursor-pointer"
               data-testid="cancel-btn"
            >
               Abbrechen
            </Button>
            <Button
               type="submit"
               className="cursor-pointer"
               data-testid="submit-btn"
            >
               Vorschau generieren
            </Button>
         </div>
      </div>
   );

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmitInternal)}
            data-testid="template-fields-form"
         >
            <div className="grid grid-cols-1 gap-6 lg:min-h-[40vh] lg:grid-cols-2">
               {preview()}
               {fieldInputs()}
            </div>
         </form>
      </Form>
   );
};

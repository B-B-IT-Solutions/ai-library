"use client";

import { FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { map, reduce } from "es-toolkit/compat";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/shadcn/button";
import { Form } from "@/components/shadcn/form";
import { CallbackFn } from "@/data/types/common";
import {
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
   fields: DPromptTemplateField[];
   onSubmit: (values: DPromptTemplateFieldValues) => void;
   onCancel: CallbackFn;
   templateContent?: string;
};

export const TemplateFieldForm: FC<Props> = ({
   fields,
   onSubmit,
   onCancel,
   templateContent,
}) => {
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

   const currentValues = form.watch() as DPromptTemplateFieldValues;

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

   const formContent = (
      <>
         <div className="space-y-4">{renderFields()}</div>
         <div className="flex justify-end gap-2 pt-2">
            <Button
               type="button"
               variant="outline"
               onClick={onCancel}
               data-testid="cancel-btn"
            >
               Abbrechen
            </Button>
            <Button type="submit" data-testid="submit-btn">
               Vorschau generieren
            </Button>
         </div>
      </>
   );

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmitInternal)}
            className="space-y-4"
            data-testid="prompt-template-fields-form"
         >
            {templateContent ? (
               <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="space-y-4">{formContent}</div>
                  <div className="flex flex-col gap-2">
                     <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Prompt-Vorschau
                     </p>
                     <div className="flex-1 overflow-y-auto rounded-md border bg-muted/30 p-4 max-h-[60vh]">
                        <TemplatePreview
                           content={templateContent}
                           values={currentValues}
                        />
                     </div>
                     <p className="text-xs text-muted-foreground">
                        <span className="inline-block rounded bg-orange-100 px-1 text-orange-700 italic mr-1">
                           {"{{platzhalter}}"}
                        </span>
                        noch nicht ausgefüllt ·{" "}
                        <span className="inline-block rounded bg-green-100 px-1 text-green-800 font-medium mr-1">
                           wert
                        </span>
                        ausgefüllt
                     </p>
                  </div>
               </div>
            ) : (
               formContent
            )}
         </form>
      </Form>
   );
};

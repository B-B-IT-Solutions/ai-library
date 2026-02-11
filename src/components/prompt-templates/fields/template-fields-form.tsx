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

type Props = {
   fields: DPromptTemplateField[];
   onSubmit: (values: DPromptTemplateFieldValues) => void;
   onCancel: CallbackFn;
};

export const TemplateFieldForm: FC<Props> = ({
   fields,
   onSubmit,
   onCancel,
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

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmitInternal)}
            className="space-y-4"
            data-testid="prompt-template-fields-form"
         >
            {renderFields()}
            <div className="flex justify-end gap-2">
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
         </form>
      </Form>
   );
};

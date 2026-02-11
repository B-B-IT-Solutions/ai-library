"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { map } from "es-toolkit/compat";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/shadcn/button";
import { Form } from "@/components/shadcn/form";
import { CallbackFn } from "@/data/types/common";
import {
   DPromptTemplateField,
   DPromptTemplateFieldValues,
} from "@/data/types/domain/prompt.template";

import { CheckBoxField } from "./field-check-box";
import { GenericField } from "./field-generic";
import { RadioField } from "./field-radio";
import { SelectField } from "./field-select";
import { TextAreaField } from "./field-textarea";

type Props = {
   fields: DPromptTemplateField[];
   onSubmit: (values: DPromptTemplateFieldValues) => void;
   onCancel: CallbackFn;
};

export const TemplateFieldForm = ({ fields, onSubmit, onCancel }: Props) => {
   const buildSchema = () => {
      const shape: Record<string, any> = {};
      fields.forEach((field) => {
         let validator: any;

         switch (field.type) {
            case "EMAIL":
               validator = z.string().email("Ungültige E-Mail");
               break;
            case "NUMBER":
               validator = z.coerce.number();
               break;
            case "DATE":
               validator = z.string(); // Or z.date() depending on input format
               break;
            case "CHECKBOX":
               validator = z.boolean().default(false);
               break;
            default:
               validator = z.string();
         }

         if (field.required && field.type !== "CHECKBOX") {
            validator = validator.min(1, `${field.label} ist erforderlich`);
         } else if (!field.required) {
            validator = validator.optional();
         }

         shape[field.name] = validator;
      });

      return z.object(shape);
   };

   const form = useForm<any>({
      resolver: zodResolver(buildSchema()),
      defaultValues: fields.reduce(
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

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
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

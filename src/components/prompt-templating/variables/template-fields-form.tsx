"use client";

import { map } from "es-toolkit/compat";
import { Control, FieldValues } from "react-hook-form";

import {
   DPromptField,
   DPromptGenerationData,
} from "@/data/types/domain/prompt";

import { CheckBoxField } from "./field/field-check-box";
import { GenericField } from "./field/field-generic";
import { RadioField } from "./field/field-radio";
import { SelectField } from "./field/field-select";
import { TextAreaField } from "./field/field-textarea";

type Props = {
   templateData: DPromptGenerationData;
   control: Control<FieldValues>;
};

export const TemplateFieldsForm = ({ templateData, control }: Props) => {
   const { allFields: fields } = templateData;

   const renderField = (field: DPromptField) => {
      switch (field.type) {
         case "TEXTAREA":
            return <TextAreaField field={field} control={control} />;
         case "SELECT":
            return <SelectField field={field} control={control} />;
         case "RADIO":
            return <RadioField field={field} control={control} />;
         case "CHECKBOX":
            return <CheckBoxField field={field} control={control} />;
         case "NUMBER":
         case "DATE":
         case "EMAIL":
         case "TEXT":
            return <GenericField field={field} control={control} />;
      }
   };

   const renderFields = () => {
      return map(fields, (field) => {
         return <div key={field.id}>{renderField(field)}</div>;
      });
   };

   return (
      <div
         className="space-y-4"
         data-testid="template-fields-form"
      >
         {renderFields()}
      </div>
   );
};

"use client";

import { map } from "es-toolkit/compat";
import { Control, FieldValues } from "react-hook-form";

import {
   DPromptGenerationData,
   DPromptVariable,
} from "@/data/types/domain/prompt";

import { CheckBoxField } from "./variable/field-check-box";
import { GenericField } from "./variable/field-generic";
import { RadioField } from "./variable/field-radio";
import { SelectField } from "./variable/field-select";
import { TextAreaField } from "./variable/field-textarea";

type Props = {
   templateData: DPromptGenerationData;
   control: Control<FieldValues>;
};

export const PromptVariablesForm = ({ templateData, control }: Props) => {
   const { allFields: fields } = templateData;

   const renderField = (field: DPromptVariable) => {
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
      <div className="space-y-4" data-testid="prompt-variables-form">
         {renderFields()}
      </div>
   );
};

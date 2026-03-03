"use client";

import { HTMLInputTypeAttribute } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

import { FormInput, FormSelect } from "@/components/shared/widgets";
import { DPromptTemplateFieldType } from "@/data/types/domain/prompt.template";

const OPTION_TYPES = ["SELECT", "RADIO"];

type Props<T extends FieldValues> = {
   name: FieldPath<T>;
   type: DPromptTemplateFieldType;
   options: string[];
   control: Control<T>;
};

export const TemplateFieldDefaultValue = <T extends FieldValues>({
   name,
   type,
   options,
   control,
}: Props<T>) => {
   const resolveInputType = (): HTMLInputTypeAttribute | undefined => {
      switch (type) {
         case "NUMBER":
            return "number";
         case "EMAIL":
            return "email";
         case "DATE":
            return "date";
         default:
            return undefined;
      }
   };

   if (OPTION_TYPES.includes(type)) {
      return (
         <FormSelect<T>
            name={name}
            label="Standardwert"
            placeholder="Standardwert auswählen"
            options={options}
            control={control}
         />
      );
   }

   return (
      <FormInput<T>
         name={name}
         label="Standardwert"
         placeholder="Standardwert des Feldes"
         type={resolveInputType()}
         control={control}
      />
   );
};

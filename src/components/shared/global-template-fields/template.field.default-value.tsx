"use client";

import { Control, FieldPath, FieldValues } from "react-hook-form";

import { FormInput } from "@/components/shared/widgets";

type Props<T extends FieldValues> = {
   name: FieldPath<T>;
   control: Control<T>;
};

export const TemplateFieldDefaultValue = <T extends FieldValues>({
   name,
   control,
}: Props<T>) => {
   return (
      <FormInput<T>
         name={name}
         label="Standardwert"
         placeholder="Standardwert des Feldes"
         control={control}
      />
   );
};

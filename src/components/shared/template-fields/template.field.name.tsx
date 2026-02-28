"use client";

import { Control, FieldPath, FieldValues, UseFormWatch } from "react-hook-form";

import { FormInput } from "@/components/shared/widgets";

type Props<T extends FieldValues> = {
   name: FieldPath<T>;
   control: Control<T>;
   watch: UseFormWatch<T>;
};

export const TemplateFieldName = <T extends FieldValues>({
   name,
   control,
   watch,
}: Props<T>) => {
   const value = watch(name) || "feldname";

   return (
      <FormInput<T>
         name={name}
         label="Name"
         placeholder="Name des Feldes"
         message={`Verwenden Sie diesen Namen als {{${value}}}`}
         control={control}
      />
   );
};

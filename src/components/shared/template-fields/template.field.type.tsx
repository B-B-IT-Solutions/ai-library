"use client";

import { Control, FieldPath, FieldValues } from "react-hook-form";

import { FormSelect } from "@/components/shared/widgets";

import { PROMPT_VARIABLE_OPTIONS } from "./utils/utils";

type Props<T extends FieldValues> = {
   name: FieldPath<T>;
   control: Control<T>;
};

export const TemplateFieldType = <T extends FieldValues>({
   name,
   control,
}: Props<T>) => {
   return (
      <FormSelect<T>
         name={name}
         label="Typ"
         options={PROMPT_VARIABLE_OPTIONS}
         control={control}
      />
   );
};

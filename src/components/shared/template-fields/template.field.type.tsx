"use client";

import { Control, FieldPath, FieldValues } from "react-hook-form";

import { FormSelect } from "@/components/shared/widgets";

import { TEMPLATE_FIELD_OPTIONS } from "./utils/utils";

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
         options={TEMPLATE_FIELD_OPTIONS}
         control={control}
      />
   );
};

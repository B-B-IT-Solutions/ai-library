"use client";

import { FC } from "react";
import { Control, FieldValues } from "react-hook-form";

import { FormSelect } from "@/components/shared/widgets";
import { DPromptTemplateField } from "@/data/types/domain/prompt.template";

type Props = {
   field: DPromptTemplateField;
   control: Control<FieldValues>;
};

export const SelectField: FC<Props> = ({ field, control }) => {
   return (
      <FormSelect<FieldValues>
         name={field.name}
         label={field.label}
         placeholder="Auswählen..."
         description={field.description}
         required={field.required}
         options={field.options || []}
         control={control}
      />
   );
};

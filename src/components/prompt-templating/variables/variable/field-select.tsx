"use client";

import { FC } from "react";
import { Control, FieldValues } from "react-hook-form";

import { FormSelect } from "@/components/shared/widgets";
import { DPromptVariable } from "@/data/types/domain/prompt";

type Props = {
   field: DPromptVariable;
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

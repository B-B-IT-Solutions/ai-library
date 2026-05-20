"use client";

import { FC } from "react";
import { Control, FieldValues } from "react-hook-form";

import { FormTextArea } from "@/components/shared/widgets";
import { DPromptVariable } from "@/data/types/domain/prompt";

type Props = {
   field: DPromptVariable;
   control: Control<FieldValues>;
};

export const TextAreaField: FC<Props> = ({ field, control }) => {
   return (
      <FormTextArea<FieldValues>
         name={field.name}
         label={field.label}
         description={field.description}
         required={field.required}
         rows={4}
         control={control}
      />
   );
};

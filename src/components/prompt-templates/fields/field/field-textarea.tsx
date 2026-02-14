"use client";

import { FC } from "react";
import { Control, FieldValues } from "react-hook-form";

import { FormTextArea } from "@/components/shared/widgets";
import { DPromptTemplateField } from "@/data/types/domain/prompt.template";

type Props = {
   field: DPromptTemplateField;
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

"use client";

import { FC } from "react";
import { Control, FieldValues } from "react-hook-form";

import { FormInput } from "@/components/shared/widgets";
import { DPromptField } from "@/data/types/domain/prompt.template";

type Props = {
   field: DPromptField;
   control: Control<FieldValues>;
};

export const GenericField: FC<Props> = ({ field, control }) => {
   return (
      <FormInput<FieldValues>
         name={field.name}
         label={field.label}
         description={field.description}
         required={field.required}
         type={field.type.toLowerCase()}
         control={control}
      />
   );
};

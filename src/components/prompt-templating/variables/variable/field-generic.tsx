"use client";

import { FC } from "react";
import { Control, FieldValues } from "react-hook-form";

import { FormInput } from "@/components/shared/widgets";
import { DPromptVariable } from "@/data/types/domain/prompt";

type Props = {
   field: DPromptVariable;
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

"use client";

import { FC } from "react";
import { Control, FieldValues } from "react-hook-form";

import { FormRadio } from "@/components/shared/widgets";
import { DPromptVariable } from "@/data/types/domain/prompt";

type Props = {
   field: DPromptVariable;
   control: Control<FieldValues>;
};

export const RadioField: FC<Props> = ({ field, control }) => {
   return (
      <FormRadio<FieldValues>
         name={field.name}
         label={field.label}
         description={field.description}
         required={field.required}
         options={field.options || []}
         control={control}
      />
   );
};

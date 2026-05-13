"use client";

import { FC } from "react";
import { Control, FieldValues } from "react-hook-form";

import { FormCheckBox } from "@/components/shared/widgets";
import { DPromptField } from "@/data/types/domain/prompt";

type Props = {
   field: DPromptField;
   control: Control<FieldValues>;
};

export const CheckBoxField: FC<Props> = ({ field, control }) => {
   return (
      <FormCheckBox<FieldValues>
         name={field.name}
         label={field.label}
         description={field.description}
         control={control}
      />
   );
};

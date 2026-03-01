"use client";

import { Control, FieldPath, FieldValues } from "react-hook-form";

import { FormCheckBox } from "@/components/shared/widgets";

type Props<T extends FieldValues> = {
   name: FieldPath<T>;
   control: Control<T>;
};

export const TemplateFieldRequired = <T extends FieldValues>({
   name,
   control,
}: Props<T>) => {
   return (
      <FormCheckBox<T>
         name={name}
         label="Dieses Feld ist erforderlich"
         className="col-span-2"
         control={control}
      />
   );
};

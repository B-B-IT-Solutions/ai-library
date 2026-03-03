"use client";

import { Control, FieldValues, Path } from "react-hook-form";

import { FormDynamicValues } from "@/components/shared/widgets";

type Props<T extends FieldValues> = {
   name: Path<T>;
   control: Control<T>;
};

export const TemplateFieldSelectOptions = <T extends FieldValues>({
   name,
   control,
}: Props<T>) => {
   return (
      <FormDynamicValues<T>
         name={name}
         label="Optionen"
         placeholder="Option eingeben"
         className="col-span-2"
         control={control}
      />
   );
};

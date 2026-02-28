"use client";

import { Control, FieldPath, FieldValues } from "react-hook-form";

import { FormTextArea } from "@/components/shared/widgets";

type Props<T extends FieldValues> = {
   name: FieldPath<T>;
   control: Control<T>;
};

export const TemplateFieldDescription = <T extends FieldValues>({
   name,
   control,
}: Props<T>) => {
   return (
      <FormTextArea<T>
         name={name}
         label="Beschreibung"
         placeholder="Beschreibung des Feldes"
         rows={2}
         className="col-span-2"
         control={control}
      />
   );
};

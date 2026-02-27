"use client";

import { Control, FieldPath, FieldValues } from "react-hook-form";

import { FormSelect } from "@/components/shared/widgets";

const FIELD_TYPES = [
   { value: "TEXT", label: "Text" },
   { value: "TEXTAREA", label: "Textarea" },
   { value: "EMAIL", label: "E-Mail" },
   { value: "NUMBER", label: "Nummer" },
   { value: "DATE", label: "Datum" },
   { value: "SELECT", label: "Auswahl" },
   { value: "CHECKBOX", label: "Checkbox" },
   { value: "RADIO", label: "Radio" },
];

type Props<T extends FieldValues> = {
   name: FieldPath<T>;
   control: Control<T>;
};

export const TemplateFieldType = <T extends FieldValues>({
   name,
   control,
}: Props<T>) => {
   return (
      <FormSelect<T>
         name={name}
         label="Typ"
         options={FIELD_TYPES}
         control={control}
      />
   );
};

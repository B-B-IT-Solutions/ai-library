"use client";

import { Control, FieldValues, Path } from "react-hook-form";

import { FormDynamicValues } from "@/components/shared/widgets";
import { DPromptFieldType } from "@/data/types/domain/prompt.template";

import { isOptionsFieldType } from "./utils/utils";

type Props<T extends FieldValues> = {
   name: Path<T>;
   type: DPromptFieldType;
   control: Control<T>;
};

export const TemplateFieldSelectOptions = <T extends FieldValues>({
   name,
   type,
   control,
}: Props<T>) => {
   if (!isOptionsFieldType(type)) {
      return null;
   }

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

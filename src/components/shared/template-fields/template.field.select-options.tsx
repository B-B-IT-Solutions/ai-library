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
      <div className="col-span-2">
         <FormDynamicValues<T>
            name={name}
            label="Optionen"
            placeholder="Option eingeben"
            control={control}
         />
      </div>
   );
};

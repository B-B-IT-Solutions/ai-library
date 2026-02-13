"use client";

import { Control, FieldValues, Path } from "react-hook-form";

import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/shadcn/form";
import { Input as ShadcnInput } from "@/components/shadcn/input";

type Props<T extends FieldValues> = {
   field: Path<T>;
   label: string;
   placeholder: string;
   control: Control<T>;
};

export const FormInput = <T extends FieldValues>({
   field: fieldName,
   label,
   placeholder,
   control,
}: Props<T>) => {
   return (
      <FormField
         control={control}
         name={fieldName}
         render={({ field }) => (
            <FormItem data-testid={fieldName}>
               <FormLabel>{label}</FormLabel>
               <FormControl>
                  <ShadcnInput {...field} placeholder={placeholder} />
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
};

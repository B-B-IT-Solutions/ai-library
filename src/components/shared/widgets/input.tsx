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
   control: Control<T>;
};

export const Input = <T extends FieldValues>({
   field: fieldName,
   control,
}: Props<T>) => {
   return (
      <FormField
         control={control}
         name={fieldName}
         render={({ field }) => (
            <FormItem data-testid={`${fieldName}-input`}>
               <FormLabel>Titel</FormLabel>
               <FormControl>
                  <ShadcnInput
                     {...field}
                     placeholder="z.B. Blog-Post Generator"
                  />
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
};

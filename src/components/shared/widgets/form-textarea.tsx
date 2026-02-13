"use client";

import { Control, FieldValues, Path } from "react-hook-form";

import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/shadcn/form";
import { Textarea } from "@/components/shadcn/textarea";

type Props<T extends FieldValues> = {
   name: Path<T>;
   label: string;
   placeholder: string;
   rows?: number;
   control: Control<T>;
};

export const FormTextArea = <T extends FieldValues>({
   name,
   label,
   placeholder,
   rows = 3,
   control,
}: Props<T>) => {
   return (
      <FormField
         control={control}
         name={name}
         render={({ field }) => (
            <FormItem data-testid={name}>
               <FormLabel>{label}</FormLabel>
               <FormControl>
                  <Textarea {...field} placeholder={placeholder} rows={rows} />
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
};

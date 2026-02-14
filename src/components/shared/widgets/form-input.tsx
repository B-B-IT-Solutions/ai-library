"use client";

import { Control, FieldValues, Path } from "react-hook-form";

import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";

type Props<T extends FieldValues> = {
   name: Path<T>;
   label: string;
   placeholder: string;
   message?: string;
   control: Control<T>;
};

export const FormInput = <T extends FieldValues>({
   name,
   label,
   placeholder,
   message,
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
                  <Input
                     {...field}
                     placeholder={placeholder}
                     data-testid="input"
                  />
               </FormControl>
               <FormMessage>
                  {message && <span className="text-slate-500">{message}</span>}
               </FormMessage>
            </FormItem>
         )}
      />
   );
};

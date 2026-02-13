"use client";

import { Control, FieldValues, Path } from "react-hook-form";

import {
   FormControl,
   FormField,
   FormItem,
   FormMessage,
} from "@/components/shadcn/form";
import { MDEditor } from "@/components/shared/md";

type Props<T extends FieldValues> = {
   name: Path<T>;
   placeholder: string;
   control: Control<T>;
};

export const FormMDEditor = <T extends FieldValues>({
   name,
   placeholder,
   control,
}: Props<T>) => {
   return (
      <FormField
         control={control}
         name={name}
         render={({ field }) => (
            <FormItem data-testid={name}>
               <FormControl>
                  <MDEditor
                     value={field.value}
                     onChange={field.onChange}
                     placeholder={placeholder}
                     minHeight={250}
                  />
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
};

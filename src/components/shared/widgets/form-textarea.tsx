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
import { cn } from "@/lib/utils";

type Props<T extends FieldValues> = {
   name: Path<T>;
   label: string;
   placeholder: string;
   rows?: number;
   className?: string;
   control: Control<T>;
};

export const FormTextArea = <T extends FieldValues>({
   name,
   label,
   placeholder,
   rows = 3,
   className,
   control,
}: Props<T>) => {
   return (
      <FormField
         control={control}
         name={name}
         render={({ field }) => (
            <FormItem className={cn(className)} data-testid={name}>
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

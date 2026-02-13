"use client";

import { Control, FieldValues, Path } from "react-hook-form";

import { Checkbox } from "@/components/shadcn/checkbox";
import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/shadcn/form";
import { cn } from "@/lib/utils";

type Props<T extends FieldValues> = {
   name: Path<T>;
   label: string;
   className?: string;
   control: Control<T>;
};

export const FormCheckBox = <T extends FieldValues>({
   name,
   label,
   className,
   control,
}: Props<T>) => {
   return (
      <FormField
         control={control}
         name={name}
         render={({ field }) => (
            <FormItem className={cn(className)} data-testid={name}>
               <FormControl>
                  <Checkbox
                     checked={field.value}
                     onCheckedChange={field.onChange}
                  />
               </FormControl>
               <FormLabel>{label}</FormLabel>
               <FormMessage />
            </FormItem>
         )}
      />
   );
};

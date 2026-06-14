"use client";

import { Control, FieldValues, Path } from "react-hook-form";

import {
   FormControl,
   FormDescription,
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
   placeholder?: string;
   description?: string | null;
   required?: boolean;
   rows?: number;
   maxLength?: number;
   className?: string;
   control: Control<T>;
};

export const FormTextArea = <T extends FieldValues>({
   name,
   label,
   placeholder,
   description,
   required,
   rows = 3,
   maxLength,
   className,
   control,
}: Props<T>) => {
   const renderlabel = () => {
      if (required) {
         return (
            <FormLabel className="gap-1">
               {label}
               <span className="text-destructive">*</span>
            </FormLabel>
         );
      }
      return <FormLabel>{label}</FormLabel>;
   };

   const renderDescription = () => {
      if (description) {
         return <FormDescription> {description}</FormDescription>;
      }
   };

   return (
      <FormField
         control={control}
         name={name}
         render={({ field }) => (
            <FormItem className={cn(className)} data-testid={name}>
               {renderlabel()}
               {renderDescription()}
               <FormControl>
                  <Textarea
                     {...field}
                     placeholder={placeholder}
                     rows={rows}
                     maxLength={maxLength}
                     data-testid="textarea"
                  />
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
};

"use client";

import { HTMLInputTypeAttribute } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

import {
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";

type Props<T extends FieldValues> = {
   name: Path<T>;
   label: string;
   placeholder?: string;
   description?: string | null;
   required?: boolean;
   message?: string;
   type?: HTMLInputTypeAttribute;
   control: Control<T>;
};

export const FormInput = <T extends FieldValues>({
   name,
   label,
   placeholder,
   description,
   required,
   message,
   type,
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
            <FormItem data-testid={name}>
               {renderlabel()}
               {renderDescription()}
               <FormControl>
                  <Input
                     {...field}
                     type={type}
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

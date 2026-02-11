"use client";

import { FC } from "react";
import { Control, FieldValues } from "react-hook-form";

import {
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/shadcn/form";
import { Textarea } from "@/components/shadcn/textarea";
import { DPromptTemplateField } from "@/data/types/domain/prompt.template";
import { toTestId } from "@/lib/utils";

type Props = {
   field: DPromptTemplateField;
   control: Control<FieldValues>;
};

export const TextAreaField: FC<Props> = ({ field, control }) => {
   return (
      <FormField
         control={control}
         name={field.name}
         render={({ field: formField }) => (
            <FormItem data-testid={`${toTestId(field.name)}-field`}>
               <FormLabel className="gap-1">
                  {field.label}
                  {field.required && (
                     <span className="text-destructive">*</span>
                  )}
               </FormLabel>
               <FormDescription> {field.description}</FormDescription>
               <FormControl>
                  <Textarea {...formField} rows={4} />
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
};

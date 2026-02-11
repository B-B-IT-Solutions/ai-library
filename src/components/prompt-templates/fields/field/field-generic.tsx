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
import { Input } from "@/components/shadcn/input";
import { DPromptTemplateField } from "@/data/types/domain/prompt.template";
import { toTestId } from "@/lib/utils";

type Props = {
   field: DPromptTemplateField;
   control: Control<FieldValues>;
};

export const GenericField: FC<Props> = ({ field, control }) => {
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
                  <Input
                     type={field.type.toLowerCase()}
                     {...formField}
                     data-testid="field-input"
                  />
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
};

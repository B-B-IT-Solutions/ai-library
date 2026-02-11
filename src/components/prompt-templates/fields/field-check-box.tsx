"use client";

import { FC } from "react";
import { Control, FieldValues } from "react-hook-form";

import { Checkbox } from "@/components/shadcn/checkbox";
import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/shadcn/form";
import { DPromptTemplateField } from "@/data/types/domain/prompt.template";

type Props = {
   field: DPromptTemplateField;
   control: Control<FieldValues>;
};

export const CheckBoxField: FC<Props> = ({ field, control }) => {
   // Use Select for RADIO since RadioGroup component doesn't exist
   return (
      <FormField
         control={control}
         name={field.name}
         render={({ field: formField }) => (
            <FormItem className="flex items-center space-x-2">
               <FormControl>
                  <Checkbox
                     checked={formField.value}
                     onCheckedChange={formField.onChange}
                  />
               </FormControl>
               <FormLabel className="!mt-0">{field.label}</FormLabel>
               {field.description && (
                  <p className="text-sm text-muted-foreground">
                     {field.description}
                  </p>
               )}
               <FormMessage />
            </FormItem>
         )}
      />
   );
};

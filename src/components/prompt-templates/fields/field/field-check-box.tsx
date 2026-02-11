"use client";

import { FC } from "react";
import { Control, FieldValues } from "react-hook-form";

import { Checkbox } from "@/components/shadcn/checkbox";
import {
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/shadcn/form";
import { DPromptTemplateField } from "@/data/types/domain/prompt.template";
import { toTestId } from "@/lib/utils";

type Props = {
   field: DPromptTemplateField;
   control: Control<FieldValues>;
};

export const CheckBoxField: FC<Props> = ({ field, control }) => {
   return (
      <FormField
         control={control}
         name={field.name}
         render={({ field: formField }) => (
            <FormItem
               className="flex items-center space-x-2"
               data-testid={`${toTestId(field.name)}-field`}
            >
               <FormControl>
                  <Checkbox
                     checked={formField.value}
                     onCheckedChange={formField.onChange}
                  />
               </FormControl>
               <FormLabel>{field.label}</FormLabel>
               <FormDescription> {field.description}</FormDescription>
               <FormMessage />
            </FormItem>
         )}
      />
   );
};

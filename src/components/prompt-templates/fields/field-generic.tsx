"use client";

import { FC } from "react";
import { Control, FieldValues } from "react-hook-form";

import {
   FormControl,
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
               <FormLabel>
                  {field.label} {field.required && "*"}
               </FormLabel>
               {field.description && (
                  <p className="text-sm text-muted-foreground">
                     {field.description}
                  </p>
               )}
               <FormControl>
                  <Input type={field.type.toLowerCase()} {...formField} />
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
};

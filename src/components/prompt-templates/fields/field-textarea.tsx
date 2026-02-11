"use client";

import { FC } from "react";
import { Control } from "react-hook-form";

import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/shadcn/form";
import { Textarea } from "@/components/shadcn/textarea";
import { DPromptTemplateField } from "@/data/types/domain/prompt.template";

type Props = {
   field: DPromptTemplateField;
   control: Control<DPromptTemplateField>;
};

export const FieldTextArea: FC<Props> = ({ field, control }) => {
   return (
      <FormField
         control={control}
         name={field.name}
         render={({ field: formField }) => (
            <FormItem>
               <FormLabel>
                  {field.label} {field.required && "*"}
               </FormLabel>
               {field.description && (
                  <p className="text-sm text-muted-foreground">
                     {field.description}
                  </p>
               )}
               <FormControl>
                  <Textarea {...formField} rows={4} />
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
};

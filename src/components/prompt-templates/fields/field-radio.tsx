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
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/shadcn/select";
import { DPromptTemplateField } from "@/data/types/domain/prompt.template";
import { toTestId } from "@/lib/utils";

type Props = {
   field: DPromptTemplateField;
   control: Control<FieldValues>;
};

export const RadioField: FC<Props> = ({ field, control }) => {
   // Use Select for RADIO since RadioGroup component doesn't exist
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
               <Select
                  onValueChange={formField.onChange}
                  defaultValue={formField.value}
               >
                  <FormControl>
                     <SelectTrigger>
                        <SelectValue placeholder="Auswählen..." />
                     </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                     {field.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                           {option}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
               <FormMessage />
            </FormItem>
         )}
      />
   );
};

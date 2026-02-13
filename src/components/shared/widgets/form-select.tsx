"use client";

import { map } from "es-toolkit/compat";
import { Control, FieldValues, Path } from "react-hook-form";

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

export type Option =
   | string
   | {
        value: string;
        label: string;
     };

type Props<T extends FieldValues> = {
   name: Path<T>;
   label: string;
   options: Option[];
   control: Control<T>;
};

export const FormSelect = <T extends FieldValues>({
   name,
   label,
   options,
   control,
}: Props<T>) => {
   const getValue = (o: Option) => {
      return typeof o === "string" ? o : o.value;
   };
   const getLabel = (o: Option) => {
      return typeof o === "string" ? o : o.label;
   };

   return (
      <FormField
         control={control}
         name={name}
         render={({ field }) => (
            <FormItem data-testid={name}>
               <FormLabel>{label}</FormLabel>
               <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                     <SelectTrigger>
                        <SelectValue />
                     </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                     {map(options, (o, idx) => (
                        <SelectItem key={idx} value={getValue(o)}>
                           {getLabel(o)}
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

"use client";

import { map } from "es-toolkit/compat";
import { Control, FieldValues, Path } from "react-hook-form";

import {
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/shadcn/form";
import { RadioGroup, RadioGroupItem } from "@/components/shadcn/radio-group";

export type Option =
   | string
   | {
        value: string;
        label: string;
     };

type Props<T extends FieldValues> = {
   name: Path<T>;
   label: string;
   description?: string | null;
   required?: boolean;
   options: Option[];
   control: Control<T>;
};

export const FormRadio = <T extends FieldValues>({
   name,
   label,
   description,
   required,
   options,
   control,
}: Props<T>) => {
   const getValue = (o: Option) => {
      return typeof o === "string" ? o : o.value;
   };

   const getLabel = (o: Option) => {
      return typeof o === "string" ? o : o.label;
   };

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
                  <RadioGroup
                     onValueChange={field.onChange}
                     defaultValue={field.value}
                     className="flex flex-col space-y-2"
                  >
                     {map(options, (o, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                           <RadioGroupItem
                              value={getValue(o)}
                              id={`${field.name}-${getValue(o)}`}
                           />
                           <label
                              htmlFor={`${field.name}-${getValue(o)}`}
                              className="cursor-pointer text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                           >
                              {getLabel(o)}
                           </label>
                        </div>
                     ))}
                  </RadioGroup>
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
};

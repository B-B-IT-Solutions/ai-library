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
import { Label } from "@/components/shadcn/label";
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

   const radioItem = (o: Option, index: number) => {
      const value = getValue(o);
      const id = `${name}-${value}`;

      return (
         <div key={index} className="flex items-center space-x-2">
            <RadioGroupItem value={value} id={id} />
            <Label
               htmlFor={id}
               className="cursor-pointer font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
               {getLabel(o)}
            </Label>
         </div>
      );
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
                     className="mt-1 flex flex-col space-y-1"
                  >
                     {map(options, (o, idx) => radioItem(o, idx))}
                  </RadioGroup>
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
};

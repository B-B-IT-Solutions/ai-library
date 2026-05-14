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
import {
   Select,
   SelectContent,
   SelectGroup,
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
   placeholder?: string;
   description?: string | null;
   required?: boolean;
   options: Option[];
   control: Control<T>;
};

export const FormSelect = <T extends FieldValues>({
   name,
   label,
   description,
   placeholder,
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
               <div className="relative">
                  <FormControl>
                     <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                     >
                        <SelectTrigger className="w-full">
                           <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectGroup>
                              {map(options, (o, idx) => (
                                 <SelectItem key={idx} value={getValue(o)}>
                                    {getLabel(o)}
                                 </SelectItem>
                              ))}
                           </SelectGroup>
                        </SelectContent>
                     </Select>
                  </FormControl>
               </div>
               <FormMessage />
            </FormItem>
         )}
      />
   );
};

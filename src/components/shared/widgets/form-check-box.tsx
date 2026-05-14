"use client";

import { Control, FieldValues, Path } from "react-hook-form";

import { Checkbox } from "@/components/shadcn/checkbox";
import {
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/shadcn/form";
import { cn } from "@/lib/utils";

type Props<T extends FieldValues> = {
   name: Path<T>;
   label: string;
   description?: string | null;
   className?: string;
   control: Control<T>;
};

export const FormCheckBox = <T extends FieldValues>({
   name,
   label,
   description,
   className,
   control,
}: Props<T>) => {
   const renderlabel = () => {
      return <FormLabel className="cursor-pointer">{label}</FormLabel>;
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
            <FormItem className={cn(className)} data-testid={name}>
               <div className="relative flex items-center space-x-2">
                  <FormControl>
                     <Checkbox
                        name={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                     />
                  </FormControl>
                  {renderlabel()}
               </div>
               {renderDescription()}
               <FormMessage />
            </FormItem>
         )}
      />
   );
};

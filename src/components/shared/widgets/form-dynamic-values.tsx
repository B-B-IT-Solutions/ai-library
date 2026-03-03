"use client";

import { useState } from "react";
import { filter, includes, isEmpty, map, trim } from "es-toolkit/compat";
import { Plus, X } from "lucide-react";
import { Control, FieldValues, Path, useController } from "react-hook-form";

import { Button } from "@/components/shadcn/button";
import { FormItem, FormLabel } from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { cn } from "@/lib/utils";

type Props<T extends FieldValues> = {
   name: Path<T>;
   label: string;
   placeholder: string;
   className?: string;
   control: Control<T>;
};

export const FormDynamicValues = <T extends FieldValues>({
   name,
   label,
   placeholder,
   className,
   control,
}: Props<T>) => {
   const [inputValue, setInputValue] = useState("");
   const { field } = useController({ name, control });

   const values: string[] = field.value ?? [];

   const handleAddValue = () => {
      const newValue = trim(inputValue);
      if (newValue && !includes(values, newValue)) {
         field.onChange([...values, newValue]);
         setInputValue("");
      }
   };

   const handleRemoveValue = (value: string) => {
      field.onChange(filter(values, (v: string) => v !== value));
   };

   const renderValues = () => {
      if (!isEmpty(values)) {
         return (
            <div className="flex flex-wrap gap-2" data-testid="current-values">
               {map(values, (value: string, idx: number) => (
                  <div
                     key={idx}
                     className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1"
                  >
                     <span className="text-sm">{value}</span>
                     <button
                        type="button"
                        onClick={() => handleRemoveValue(value)}
                        className="cursor-pointer text-slate-500 hover:text-slate-700"
                        data-testid="remove-value-btn"
                     >
                        <X className="h-3 w-3" />
                     </button>
                  </div>
               ))}
            </div>
         );
      }
   };

   return (
      <FormItem className={cn(className)} data-testid={name}>
         <FormLabel>{label}</FormLabel>
         {renderValues()}
         <div className="flex gap-2">
            <Input
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               placeholder={placeholder}
               onKeyDown={(e) => {
                  if (e.key === "Enter") {
                     e.preventDefault();
                     handleAddValue();
                  }
               }}
               data-testid="input"
            />
            <Button
               type="button"
               onClick={handleAddValue}
               variant="outline"
               className="cursor-pointer"
               data-testid="add-value-btn"
            >
               <Plus className="h-4 w-4" />
               Hinzufügen
            </Button>
         </div>
      </FormItem>
   );
};

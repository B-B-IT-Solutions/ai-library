"use client";

import { filter, includes, isEmpty, map, trim } from "es-toolkit/compat";
import { Plus, X } from "lucide-react";
import {
   Control,
   FieldValues,
   Path,
   PathValue,
   UseFormSetValue,
   UseFormWatch,
} from "react-hook-form";

import { Button } from "@/components/shadcn/button";
import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";

type Props<T extends FieldValues> = {
   name: Path<T>;
   nameInput: Path<T>;
   label: string;
   placeholder: string;
   control: Control<T>;
   watch: UseFormWatch<T>;
   setValue: UseFormSetValue<T>;
};

export const FormDynamicValues = <T extends FieldValues>({
   name,
   nameInput,
   label,
   placeholder,
   control,
   watch,
   setValue,
}: Props<T>) => {
   const values = watch(name) as PathValue<T, typeof name>;
   const valueInput = watch(nameInput) as PathValue<T, typeof nameInput>;

   const handleAddValue = () => {
      const newValue = trim(valueInput);
      if (newValue && !includes(values, newValue)) {
         const newValues = [...values, newValue] as PathValue<T, typeof name>;
         const newInput = "" as PathValue<T, typeof nameInput>;

         setValue(name, newValues);
         setValue(nameInput, newInput);
      }
   };

   const handleRemoveValue = (category: string) => {
      const newValues = filter(
         values,
         (c: string) => c !== category
      ) as PathValue<T, typeof name>;

      setValue(name, newValues);
   };

   const renderValues = () => {
      if (!isEmpty(values)) {
         return (
            <div
               className="mt-2 flex flex-wrap gap-2"
               data-testid="current-values"
            >
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
                        data-testid="remove-btn"
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
      <FormField
         control={control}
         name={nameInput}
         render={({ field }) => (
            <FormItem data-testid={name}>
               <FormLabel>{label}</FormLabel>
               {renderValues()}
               <div className="flex gap-2">
                  <FormControl>
                     <Input
                        {...field}
                        placeholder={placeholder}
                        onKeyDown={(e) => {
                           if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddValue();
                           }
                        }}
                        data-testid="input"
                     />
                  </FormControl>
                  <Button
                     type="button"
                     onClick={handleAddValue}
                     variant="outline"
                     className="cursor-pointer"
                     data-testid="add-btn"
                  >
                     <Plus className="h-4 w-4" />
                     Hinzufügen
                  </Button>
               </div>
            </FormItem>
         )}
      />
   );
};

"use client";

import { filter, includes, isEmpty, map, trim } from "es-toolkit/compat";
import { X } from "lucide-react";
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
   const categories = watch(name) as PathValue<T, typeof name>;
   const categoryInput = watch(nameInput) as PathValue<T, typeof nameInput>;

   const handleAddCategory = () => {
      const newCategory = trim(categoryInput);
      if (newCategory && !includes(categories, newCategory)) {
         const newCategories = [...categories, newCategory] as PathValue<
            T,
            typeof name
         >;
         const newInput = "" as PathValue<T, typeof nameInput>;

         setValue(name, newCategories);
         setValue(nameInput, newInput);
      }
   };

   const handleRemoveCategory = (category: string) => {
      const newCategories = filter(
         categories,
         (c: string) => c !== category
      ) as PathValue<T, typeof name>;

      setValue(name, newCategories);
   };

   const renderValues = () => {
      if (!isEmpty(categories)) {
         return (
            <div
               className="mt-2 flex flex-wrap gap-2"
               data-testid="current-values"
            >
               {map(categories, (category: string) => (
                  <div
                     key={category}
                     className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1"
                  >
                     <span className="text-sm">{category}</span>
                     <button
                        type="button"
                        onClick={() => handleRemoveCategory(category)}
                        className="cursor-pointer text-slate-500 hover:text-slate-700"
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
                              handleAddCategory();
                           }
                        }}
                        data-testid="input"
                     />
                  </FormControl>
                  <Button
                     type="button"
                     onClick={handleAddCategory}
                     variant="outline"
                     data-testid="add-btn"
                  >
                     Hinzufügen
                  </Button>
               </div>
            </FormItem>
         )}
      />
   );
};

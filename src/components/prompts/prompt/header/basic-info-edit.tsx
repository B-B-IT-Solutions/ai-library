"use client";

import { FC, useEffect, useState } from "react";
import { map } from "es-toolkit/compat";
import { BookType, Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { Control, FieldArrayWithId, UseFormRegister } from "react-hook-form";

import { Button } from "@/components/shadcn/button";
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from "@/components/shadcn/command";
import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/shadcn/popover";
import { PromptFormValues } from "@/data/types/domain/prompt";

const AI_MODELS = [
   "Claude Sonnet 4.5",
   "Claude Opus 4",
   "GPT-4",
   "GPT-4 Turbo",
   "GPT-3.5",
   "Gemini Pro",
   "Gemini Ultra",
   "Llama 3",
   "Mistral Large",
];

type BasicInfoEditProps = {
   control: Control<PromptFormValues>;
   register: UseFormRegister<PromptFormValues>;
   categories: FieldArrayWithId<PromptFormValues, "categories", "id">[];
   addCategory: (value: string) => void;
   removeCategory: (index: number) => void;
};

export const BasicInfoEdit: FC<BasicInfoEditProps> = ({
   control,
   register,
   categories,
   addCategory,
   removeCategory,
}) => {
   const [open, setOpen] = useState(false);
   const [customModel, setCustomModel] = useState("");

   useEffect(() => {
      if (categories.length === 0) {
         addCategory("");
      }
   }, [categories.length, addCategory]);

   const titel = () => {
      return (
         <FormField
            control={control}
            name="title"
            render={({ field }) => (
               <FormItem data-testid="title">
                  <FormLabel className="text-sm font-medium text-slate-700">
                     Titel
                  </FormLabel>
                  <FormControl>
                     <Input
                        {...field}
                        placeholder="Prompt-Titel eingeben..."
                        data-testid="title-input"
                     />
                  </FormControl>
                  <FormMessage data-testid="title-form-message" />
               </FormItem>
            )}
         />
      );
   };

   const recommendedModel = () => {
      return (
         <FormField
            control={control}
            name="recommendedModel"
            render={({ field }) => (
               <FormItem
                  className="flex flex-col"
                  data-testid="recommended-model"
               >
                  <FormLabel className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                     Empfohlenes Modell
                  </FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                     <PopoverTrigger asChild>
                        <FormControl>
                           <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="w-full justify-between font-normal"
                              data-testid="recommended-model-trigger-btn"
                           >
                              {field.value || "Modell auswählen..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                           </Button>
                        </FormControl>
                     </PopoverTrigger>
                     <PopoverContent className="w-full p-0" align="start">
                        <Command>
                           <CommandInput
                              placeholder="Modell suchen oder eingeben..."
                              value={customModel}
                              onValueChange={setCustomModel}
                              data-testid="model-input"
                           />
                           <CommandList>
                              <CommandEmpty className="p-0">
                                 <div className="px-1 py-1">
                                    <Button
                                       type="button"
                                       variant="ghost"
                                       className="w-full justify-start"
                                       onClick={() => {
                                          field.onChange(customModel);
                                          setOpen(false);
                                          setCustomModel("");
                                       }}
                                       data-testid="add-new-model"
                                    >
                                       <Plus className="mr-1 h-4 w-4" />
                                       &quot;{customModel}&quot; verwenden
                                    </Button>
                                 </div>
                              </CommandEmpty>
                              <CommandGroup>
                                 {AI_MODELS.map((model) => (
                                    <CommandItem
                                       key={model}
                                       value={model}
                                       onSelect={() => {
                                          field.onChange(model);
                                          setOpen(false);
                                          setCustomModel("");
                                       }}
                                    >
                                       <Check
                                          className={`mr-2 h-4 w-4 ${
                                             field.value === model
                                                ? "opacity-100"
                                                : "opacity-0"
                                          }`}
                                       />
                                       {model}
                                    </CommandItem>
                                 ))}
                              </CommandGroup>
                           </CommandList>
                        </Command>
                     </PopoverContent>
                  </Popover>
                  <FormMessage />
               </FormItem>
            )}
         />
      );
   };

   const renderCategories = () => {
      return (
         <div className="space-y-2" data-testid="categories">
            <FormLabel className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
               Kategorien
            </FormLabel>
            <div className="space-y-2">
               {map(categories, (field, index) => (
                  <div key={field.id} className="flex gap-2">
                     <Input
                        {...register(`categories.${index}`)}
                        placeholder="Kategoriename eingeben"
                        className="flex-1"
                     />
                     <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeCategory(index)}
                        className="shrink-0 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                        data-testid={`remove-category-btn-${index}`}
                     >
                        <X className="h-4 w-4" />
                     </Button>
                  </div>
               ))}
            </div>
            <div className="flex justify-end">
               <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addCategory("")}
                  data-testid="add-category-btn"
               >
                  <Plus className="h-4 w-4" />
                  Hinzufügen
               </Button>
            </div>
         </div>
      );
   };

   return (
      <section className="space-y-4" data-testid="basic-info-edit">
         <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <BookType className="h-5 w-5 text-indigo-600" />
            Allgemeine Informationen
         </h3>

         {titel()}
         {recommendedModel()}
         {renderCategories()}
      </section>
   );
};

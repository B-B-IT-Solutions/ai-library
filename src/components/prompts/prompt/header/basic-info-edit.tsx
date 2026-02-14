"use client";

import { FC, useState } from "react";
import { BookType, Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";

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
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/shadcn/popover";
import { FormDynamicValues, FormInput } from "@/components/shared/widgets";
import { DPromptUpdate } from "@/data/types/domain/prompt";

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

type Props = {
   control: Control<DPromptUpdate>;
   watch: UseFormWatch<DPromptUpdate>;
   setValue: UseFormSetValue<DPromptUpdate>;
};

export const BasicInfoEdit: FC<Props> = ({ control, watch, setValue }) => {
   const [open, setOpen] = useState(false);
   const [customModel, setCustomModel] = useState("");

   const title = () => {
      return (
         <FormInput<DPromptUpdate>
            name="title"
            label="Titel"
            placeholder="Prompt-Titel eingeben..."
            control={control}
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
         <FormDynamicValues<DPromptUpdate>
            name="categories"
            nameInput="categoryInput"
            label="Kategorien"
            placeholder="Kategorie hinzufügen"
            control={control}
            watch={watch}
            setValue={setValue}
         />
      );
   };

   return (
      <section className="space-y-4" data-testid="basic-info-edit">
         <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <BookType className="h-5 w-5 text-indigo-600" />
            Allgemeine Informationen
         </h3>

         {title()}
         {recommendedModel()}
         {renderCategories()}
      </section>
   );
};

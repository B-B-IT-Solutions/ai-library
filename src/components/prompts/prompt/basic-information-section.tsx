"use client";

import { FC } from "react";
import { map } from "es-toolkit/compat";
import { Cpu, Plus, Tag, Type, X } from "lucide-react";
import { Control, FieldArrayWithId, UseFormRegister } from "react-hook-form";

import { Button } from "@/components/shadcn/button";
import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/shadcn/select";

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
   "Other",
];

type PromptFormValues = {
   id?: string;
   title: string;
   content: string;
   categories: string[];
   recommendedModel: string;
   followUpPrompts: string[];
};

type BasicInformationSectionProps = {
   control: Control<PromptFormValues>;
   register: UseFormRegister<PromptFormValues>;
   categories: FieldArrayWithId<PromptFormValues, "categories", "id">[];
   addCategory: (value: string) => void;
   removeCategory: (index: number) => void;
};

export const BasicInformationSection: FC<BasicInformationSectionProps> = ({
   control,
   register,
   categories,
   addCategory,
   removeCategory,
}) => {
   return (
      <section className="space-y-4">
         <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Type className="h-5 w-5 text-indigo-600" />
            Allgemeine Informationen
         </h3>

         <FormField
            control={control}
            name="title"
            render={({ field }) => (
               <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">
                     Titel
                  </FormLabel>
                  <FormControl>
                     <Input
                        placeholder="Prompt-Titel eingeben..."
                        {...field}
                     />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />

         <FormField
            control={control}
            name="recommendedModel"
            render={({ field }) => (
               <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                     <Cpu className="h-4 w-4 text-indigo-600" />
                     Empfohlenes Modell
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                     <FormControl>
                        <SelectTrigger>
                           <SelectValue placeholder="Modell auswählen" />
                        </SelectTrigger>
                     </FormControl>
                     <SelectContent>
                        {AI_MODELS.map((model) => (
                           <SelectItem key={model} value={model}>
                              {model}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
                  <FormMessage />
               </FormItem>
            )}
         />

         {/* Categories Field */}
         <div className="space-y-2">
            <div className="flex items-center justify-between">
               <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <Tag className="h-4 w-4 text-indigo-600" />
                  Kategorien
               </FormLabel>
               <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addCategory("")}
               >
                  <Plus className="h-4 w-4" />
                  Hinzufügen
               </Button>
            </div>

            {categories.length > 0 ? (
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
                           className="shrink-0 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                        >
                           <X className="h-4 w-4" />
                        </Button>
                     </div>
                  ))}
               </div>
            ) : (
               <p className="text-sm text-slate-500 italic">
                  Noch keine Kategorien hinzugefügt.
               </p>
            )}
         </div>
      </section>
   );
};

"use client";

import { FC } from "react";
import { isEmpty, map } from "es-toolkit/compat";
import { X } from "lucide-react";
import { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";

import { Button } from "@/components/shadcn/button";
import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import {
   FormDynamicValues,
   FormInput,
   FormSelect,
   FormTextArea,
} from "@/components/shared/widgets";
import { DPromptTemplateUpdate } from "@/data/types/domain/prompt.template";

const RECOMMENDED_MODELS = [
   "Claude 3.5 Sonnet",
   "Claude 3 Opus",
   "GPT-4",
   "GPT-4 Turbo",
   "GPT-3.5 Turbo",
];

type Props = {
   control: Control<DPromptTemplateUpdate>;
   watch: UseFormWatch<DPromptTemplateUpdate>;
   setValue: UseFormSetValue<DPromptTemplateUpdate>;
};

export const BasicInfo: FC<Props> = ({ control, watch, setValue }) => {
   const categories = watch("categories");
   const categoryInput = watch("categoryInput");

   const handleAddCategory = () => {
      if (categoryInput?.trim() && !categories.includes(categoryInput.trim())) {
         setValue("categories", [...categories, categoryInput.trim()]);
         setValue("categoryInput", "");
      }
   };

   const handleRemoveCategory = (category: string) => {
      setValue(
         "categories",
         categories.filter((c: string) => c !== category)
      );
   };

   const title = () => {
      return (
         <FormInput<DPromptTemplateUpdate>
            name="title"
            label="Titel"
            placeholder="z.B. Blog-Post Generator"
            control={control}
         />
      );
   };

   const description = () => {
      return (
         <FormTextArea<DPromptTemplateUpdate>
            name="description"
            label="Beschreibung"
            placeholder="Beschreibung der Vorlage"
            rows={3}
            control={control}
         />
      );
   };

   const detailedDescription = () => {
      return (
         <FormTextArea<DPromptTemplateUpdate>
            name="detailedDescription"
            label="Detaillierte Beschreibung"
            placeholder="Ausführliche Beschreibung der Vorlage"
            rows={4}
            control={control}
         />
      );
   };

   const recommendedModel = () => {
      return (
         <FormSelect<DPromptTemplateUpdate>
            name="recommendedModel"
            label="Empfohlenes Modell"
            options={RECOMMENDED_MODELS}
            control={control}
         />
      );
   };

   const renderCategories_ = () => {
      return (
         <FormDynamicValues<DPromptTemplateUpdate>
            name="categories"
            nameInput="categoryInput"
            label="Empfohlenes Modell"
            placeholder="Kategorie hinzufügen"
            control={control}
            watch={watch}
            setValue={setValue}
         />
      );
   };

   const renderCategories = () => {
      return (
         <FormField
            control={control}
            name="categoryInput"
            render={({ field }) => (
               <FormItem data-testid="categories">
                  <FormLabel>Kategorien</FormLabel>
                  {!isEmpty(categories) && (
                     <div className="mt-2 flex flex-wrap gap-2">
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
                  )}
                  <div className="flex gap-2">
                     <FormControl>
                        <Input
                           {...field}
                           placeholder="Kategorie hinzufügen"
                           onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                 e.preventDefault();
                                 handleAddCategory();
                              }
                           }}
                        />
                     </FormControl>
                     <Button
                        type="button"
                        onClick={handleAddCategory}
                        variant="outline"
                     >
                        Hinzufügen
                     </Button>
                  </div>
               </FormItem>
            )}
         />
      );
   };

   return (
      <section className="space-y-4" data-testid="basic-info">
         {title()}
         {description()}
         {detailedDescription()}
         {recommendedModel()}
         {renderCategories_()}
         {renderCategories()}
      </section>
   );
};

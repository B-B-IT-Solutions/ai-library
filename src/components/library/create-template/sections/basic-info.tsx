"use client";

import { FC } from "react";
import { Settings, X } from "lucide-react";
import { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";

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
import { Textarea } from "@/components/shadcn/textarea";

const RECOMMENDED_MODELS = [
   "Claude 3.5 Sonnet",
   "Claude 3 Opus",
   "GPT-4",
   "GPT-4 Turbo",
   "GPT-3.5 Turbo",
];

type FormData = {
   title: string;
   description: string;
   detailedDescription: string;
   recommendedModel: string;
   categories: string[];
   categoryInput?: string;
   fields: any[];
};

type Props = {
   control: Control<FormData>;
   watch: UseFormWatch<FormData>;
   setValue: UseFormSetValue<FormData>;
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
         categories.filter((c) => c !== category)
      );
   };

   const title = () => {
      return (
         <FormField
            control={control}
            name="title"
            render={({ field }) => (
               <FormItem data-testid="title">
                  <FormLabel>Titel *</FormLabel>
                  <FormControl>
                     <Input {...field} placeholder="z.B. Blog-Post Generator" />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />
      );
   };

   const description = () => {
      return (
         <FormField
            control={control}
            name="description"
            render={({ field }) => (
               <FormItem data-testid="description">
                  <FormLabel>Beschreibung *</FormLabel>
                  <FormControl>
                     <Textarea
                        {...field}
                        placeholder="Beschreibung der Vorlage"
                        rows={3}
                     />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />
      );
   };

   const detailedDescription = () => {
      return (
         <FormField
            control={control}
            name="detailedDescription"
            render={({ field }) => (
               <FormItem data-testid="detailedDescription">
                  <FormLabel>Detaillierte Beschreibung *</FormLabel>
                  <FormControl>
                     <Textarea
                        {...field}
                        placeholder="Ausführliche Beschreibung der Vorlage"
                        rows={4}
                     />
                  </FormControl>
                  <FormMessage />
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
               <FormItem data-testid="recommendedModel">
                  <FormLabel>Empfohlenes Modell *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                     <FormControl>
                        <SelectTrigger>
                           <SelectValue />
                        </SelectTrigger>
                     </FormControl>
                     <SelectContent>
                        {RECOMMENDED_MODELS.map((model) => (
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
                  {categories.length > 0 && (
                     <div className="mt-2 flex flex-wrap gap-2">
                        {categories.map((category) => (
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
      <section className="space-y-4">
         <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
               <Settings className="h-5 w-5 text-indigo-600" />
               Grundlegende Informationen
            </h3>
         </div>
         {title()}
         {description()}
         {detailedDescription()}
         {recommendedModel()}
         {renderCategories()}
      </section>
   );
};

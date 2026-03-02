"use client";

import { FC } from "react";
import { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";

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

   const renderCategories = () => {
      return (
         <FormDynamicValues<DPromptTemplateUpdate>
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
      <section className="space-y-4" data-testid="basic-info">
         {title()}
         {description()}
         {recommendedModel()}
         {renderCategories()}
      </section>
   );
};

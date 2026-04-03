"use client";

import { FC } from "react";
import { Control } from "react-hook-form";

import {
   FormDynamicValues,
   FormInput,
   FormSelect,
   FormTextArea,
} from "@/components/shared/widgets";
import { DPromptTemplateUpdate } from "@/data/types/domain/prompt.template";

const RECOMMENDED_MODELS = [
   "Claude",
   "ChatGPT",
   "Gemini",
   "Perplexity",
   "Midjourney",
];

type Props = {
   control: Control<DPromptTemplateUpdate>;
};

export const BasicInfo: FC<Props> = ({ control }) => {
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
            label="Kategorien"
            placeholder="Kategorie hinzufügen"
            control={control}
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

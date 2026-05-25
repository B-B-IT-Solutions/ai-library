"use client";

import { Control } from "react-hook-form";

import {
   FormDynamicValues,
   FormInput,
   FormSelect,
   FormTextArea,
} from "@/components/shared/widgets";
import { DPromptUpdate } from "@/data/types/domain/prompt";

const RECOMMENDED_MODELS = [
   "Claude",
   "ChatGPT",
   "Gemini",
   "Perplexity",
   "Midjourney",
];

type Props = {
   control: Control<DPromptUpdate>;
};

export const BasicInfo = ({ control }: Props) => {
   return (
      <section className="space-y-4" data-testid="basic-info">
         <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
            Basisinformationen
         </p>
         <FormInput<DPromptUpdate>
            name="title"
            label="Titel"
            placeholder="z.B. Blog-Post Generator"
            control={control}
         />
         <FormTextArea<DPromptUpdate>
            name="description"
            label="Beschreibung"
            placeholder="Beschreiben Sie den Zweck dieses Prompts"
            rows={3}
            control={control}
         />
         <FormSelect<DPromptUpdate>
            name="recommendedModel"
            label="Empfohlenes Modell"
            options={RECOMMENDED_MODELS}
            control={control}
         />
         <FormDynamicValues<DPromptUpdate>
            name="categories"
            label="Kategorien"
            placeholder="Kategorie hinzufügen"
            control={control}
         />
      </section>
   );
};

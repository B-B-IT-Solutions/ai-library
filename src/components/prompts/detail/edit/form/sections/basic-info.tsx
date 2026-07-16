"use client";

import { Control } from "react-hook-form";

import {
   FormComboBoxLoadableValue,
   FormComboBoxLoadableValues,
   FormInput,
   FormTextArea,
} from "@/components/shared/widgets";
import {
   infiniteLoadPromptCategoriesPageOptions,
   infiniteLoadPromptModelsPageOptions,
} from "@/data/ts-queries/prompt";
import { DPromptUpdate } from "@/data/types/domain/prompt";

type Props = {
   control: Control<DPromptUpdate>;
};

export const BasicInfo = ({ control }: Props) => {
   return (
      <section className="space-y-4" data-testid="basic-info">
         <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
            Basisinformationen
         </p>
         <FormInput<DPromptUpdate>
            name="title"
            label="Titel"
            placeholder="Geben Sie den Titel des Prompts ein"
            control={control}
         />
         <FormTextArea<DPromptUpdate>
            name="description"
            label="Beschreibung"
            placeholder="Beschreiben Sie den Zweck dieses Prompts"
            rows={3}
            control={control}
         />
         <FormComboBoxLoadableValue<DPromptUpdate>
            name="recommendedModel"
            label="Empfohlenes Modell"
            placeholder="Modell auswählen oder erstellen"
            required={true}
            queryOptions={infiniteLoadPromptModelsPageOptions}
            control={control}
         />
         <FormComboBoxLoadableValues<DPromptUpdate>
            name="categories"
            label="Kategorien"
            placeholder="Kategorie hinzufügen"
            queryOptions={infiniteLoadPromptCategoriesPageOptions}
            control={control}
         />
      </section>
   );
};

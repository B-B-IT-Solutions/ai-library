"use client";

import { Control } from "react-hook-form";

import { FormMDEditor } from "@/components/shared/widgets";
import { DPromptUpdate } from "@/data/types/domain/prompt";

type Props = {
   control: Control<DPromptUpdate>;
};

export const PromptTemplateContent = ({ control }: Props) => {
   return (
      <section className="space-y-4" data-testid="prompt-template-content">
         <p className="text-sm text-slate-500">
            Verwenden Sie{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5">
               {`{{feld_name}}`}
            </code>{" "}
            für Platzhalter, die durch Ihre Felder ersetzt werden
         </p>
         <FormMDEditor<DPromptUpdate>
            name="content"
            placeholder="Du bist ein erfahrener {{rolle}}. Erstelle einen {{format}} über {{thema}} für {{zielgruppe}}."
            control={control}
         />
      </section>
   );
};

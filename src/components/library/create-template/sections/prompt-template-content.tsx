"use client";

import { FC } from "react";
import { FileText } from "lucide-react";
import { Control } from "react-hook-form";

import { FormMDEditor } from "@/components/shared/widgets";
import { DPromptTemplateUpdate } from "@/data/types/domain/prompt.template";

type Props = {
   control: Control<DPromptTemplateUpdate>;
};

export const PromptTemplateContent: FC<Props> = ({ control }) => {
   const content = () => {
      return (
         <FormMDEditor<DPromptTemplateUpdate>
            name="content"
            placeholder="Verwenden Sie {{feldname}} für Platzhalter, z.B. 'Schreibe einen Blog-Post über {{thema}}'"
            control={control}
         />
      );
   };

   return (
      <section className="space-y-4" data-testid="prompt-template-content">
         <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
               <FileText className="h-5 w-5 text-indigo-600" />
               Prompt-Vorlage
            </h3>
            <p className="mt-1 text-sm text-slate-500">
               Verwenden Sie{" "}
               <code className="rounded bg-slate-100 px-1 py-0.5">
                  {`{{feldname}}`}
               </code>{" "}
               für Platzhalter, die durch Ihre Felder ersetzt werden
            </p>
         </div>
         {content()}
      </section>
   );
};

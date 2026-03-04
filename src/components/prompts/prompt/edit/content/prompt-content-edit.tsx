"use client";

import { FC } from "react";
import { FileText } from "lucide-react";
import { Control } from "react-hook-form";

import { FormMDEditor } from "@/components/shared/widgets";
import { DPromptUpdate } from "@/data/types/domain/prompt";

type PromptContentEditProps = {
   control: Control<DPromptUpdate>;
   isEdit: boolean;
};

export const PromptContentEdit: FC<PromptContentEditProps> = ({
   control,
   isEdit,
}) => {
   const content = () => {
      return (
         <FormMDEditor<DPromptUpdate>
            name="content"
            placeholder="Prompt-Inhalt eingeben..."
            control={control}
         />
      );
   };
   return (
      <section className="space-y-4" data-testid="prompt-content-edit">
         <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
               <FileText className="h-5 w-5 text-indigo-600" />
               Prompt
            </h3>
            {isEdit && (
               <p
                  className="mt-1 text-sm text-slate-500"
                  data-testid="version-notice"
               >
                  Verwenden Sie &quot;Als neue Version speichern&quot; um einen
                  Versions-Snapshot zu erstellen.
               </p>
            )}
         </div>
         {content()}
      </section>
   );
};

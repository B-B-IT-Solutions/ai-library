"use client";

import { FC } from "react";
import { FileText } from "lucide-react";
import { Control } from "react-hook-form";

import {
   FormControl,
   FormField,
   FormItem,
   FormMessage,
} from "@/components/shadcn/form";
import { MDEditor } from "@/components/shared/md";
import { DPromptUpdate } from "@/data/types/domain/prompt";

type PromptContentEditProps = {
   control: Control<DPromptUpdate>;
   isEdit: boolean;
};

export const PromptContentEdit: FC<PromptContentEditProps> = ({
   control,
   isEdit,
}) => {
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

         <FormField
            control={control}
            name="content"
            render={({ field }) => (
               <FormItem>
                  <FormControl>
                     <MDEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Prompt-Inhalt eingeben..."
                        minHeight={200}
                        data-testid="prompt-editor"
                     />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />
      </section>
   );
};

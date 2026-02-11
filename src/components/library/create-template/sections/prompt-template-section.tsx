"use client";

import { FC } from "react";
import { FileText } from "lucide-react";
import { Control } from "react-hook-form";

import { FormControl, FormField, FormItem, FormMessage } from "@/components/shadcn/form";
import { MDEditor } from "@/components/shared/md";

type FormData = {
   content: string;
};

type Props = {
   control: Control<FormData>;
};

export const PromptTemplateSection: FC<Props> = ({ control }) => {
   return (
      <section className="space-y-4">
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

         <FormField
            control={control}
            name="content"
            render={({ field }) => (
               <FormItem>
                  <FormControl>
                     <MDEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Verwenden Sie {{feldname}} für Platzhalter, z.B. 'Schreibe einen Blog-Post über {{thema}}'"
                        minHeight={250}
                        data-testid="template-editor"
                     />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />
      </section>
   );
};

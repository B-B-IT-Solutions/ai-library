"use client";

import { FC } from "react";
import { FileText } from "lucide-react";
import { Control } from "react-hook-form";

import { AutosizeTextarea } from "@/components/shadcn/autosize-textarea";
import {
   FormControl,
   FormField,
   FormItem,
   FormMessage,
} from "@/components/shadcn/form";

type PromptFormValues = {
   id?: string;
   title: string;
   content: string;
   categories: string[];
   recommendedModel: string;
   followUpPrompts: string[];
};

type PromptContentSectionProps = {
   control: Control<PromptFormValues>;
   isEditMode: boolean;
};

export const PromptContentSection: FC<PromptContentSectionProps> = ({
   control,
   isEditMode,
}) => {
   return (
      <section className="space-y-4">
         <div>
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
               <FileText className="h-5 w-5 text-indigo-600" />
               Prompt
            </h3>
            {isEditMode && (
               <p className="text-sm text-slate-500 mt-1">
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
                     <AutosizeTextarea
                        placeholder="Prompt-Inhalt eingeben..."
                        minHeight={200}
                        className="font-mono text-sm"
                        {...field}
                     />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />
      </section>
   );
};

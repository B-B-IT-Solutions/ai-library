"use client";

import { FC, useEffect } from "react";
import { map } from "es-toolkit/compat";
import { MessageSquarePlus, Plus, X } from "lucide-react";
import { Control, FieldArrayWithId } from "react-hook-form";

import { AutosizeTextarea } from "@/components/shadcn/autosize-textarea";
import { Button } from "@/components/shadcn/button";
import { FormControl, FormField, FormItem } from "@/components/shadcn/form";

export type PromptFormValues = {
   id?: string;
   title: string;
   content: string;
   categories: string[];
   recommendedModel: string;
   followUpPrompts: string[];
};

type FollowUpPromptsEditProps = {
   control: Control<PromptFormValues>;
   followUpPrompts: FieldArrayWithId<
      PromptFormValues,
      "followUpPrompts",
      "id"
   >[];
   addFollowUpPrompt: (value: string) => void;
   removeFollowUpPrompt: (index: number) => void;
};

export const FollowUpPromptsEdit: FC<FollowUpPromptsEditProps> = ({
   control,
   followUpPrompts,
   addFollowUpPrompt,
   removeFollowUpPrompt,
}) => {
   useEffect(() => {
      if (followUpPrompts.length === 0) {
         addFollowUpPrompt("");
      }
   }, [followUpPrompts.length, addFollowUpPrompt]);

   return (
      <section className="space-y-4">
         <div>
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
               <MessageSquarePlus className="h-5 w-5 text-indigo-600" />
               Folge-Prompts
            </h3>
            <p className="text-sm text-slate-500 mt-1">
               Vorgeschlagene Folgefragen, die Benutzer stellen könnten.
            </p>
         </div>

         {followUpPrompts.length > 0 ? (
            <div className="space-y-4">
               {map(followUpPrompts, (field, idx) => (
                  <FormField
                     key={field.id}
                     control={control}
                     name={`followUpPrompts.${idx}`}
                     render={({ field }) => (
                        <FormItem>
                           <div className="flex gap-2 items-start">
                              <FormControl>
                                 <AutosizeTextarea
                                    placeholder="Folge-Prompt eingeben"
                                    className="flex-1"
                                    minHeight={60}
                                    {...field}
                                 />
                              </FormControl>
                              <Button
                                 type="button"
                                 variant="outline"
                                 size="icon"
                                 onClick={() => removeFollowUpPrompt(idx)}
                                 className="shrink-0 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                              >
                                 <X className="h-4 w-4" />
                              </Button>
                           </div>
                        </FormItem>
                     )}
                  />
               ))}
            </div>
         ) : (
            <p className="text-sm text-slate-500 italic">
               Noch keine Folge-Prompts hinzugefügt.
            </p>
         )}

         <div className="flex justify-end">
            <Button
               type="button"
               variant="outline"
               size="sm"
               onClick={() => addFollowUpPrompt("")}
            >
               <Plus className="h-4 w-4" />
               Hinzufügen
            </Button>
         </div>
      </section>
   );
};

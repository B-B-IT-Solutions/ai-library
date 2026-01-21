"use client";

import { FC, useEffect } from "react";
import { isEmpty, map } from "es-toolkit/compat";
import { MessageSquarePlus, Plus } from "lucide-react";
import { Control, FieldArrayWithId } from "react-hook-form";

import { Button } from "@/components/shadcn/button";

import { FollowUpPromptEdit } from "./follow-up-prompt-edit";

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

   const prompts = () => {
      if (isEmpty(followUpPrompts)) {
         return (
            <p className="text-sm text-slate-500 italic">
               Noch keine Folge-Prompts hinzugefügt.
            </p>
         );
      }
      return (
         <div className="space-y-4">
            {map(followUpPrompts, (_, idx) => (
               <FollowUpPromptEdit
                  key={idx}
                  control={control}
                  index={idx}
                  removeFollowUpPrompt={removeFollowUpPrompt}
               />
            ))}
         </div>
      );
   };

   const addBtn = () => {
      return (
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
      );
   };

   return (
      <section className="space-y-4" data-testid="follow-up-prompts-edit">
         <div>
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
               <MessageSquarePlus className="h-5 w-5 text-indigo-600" />
               Folge-Prompts
            </h3>
            <p className="text-sm text-slate-500 mt-1">
               Vorgeschlagene Folgefragen, die Benutzer stellen könnten.
            </p>
         </div>
         {prompts()}
         {addBtn()}
      </section>
   );
};

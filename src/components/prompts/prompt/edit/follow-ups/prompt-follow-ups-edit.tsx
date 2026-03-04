"use client";

import { FC, useEffect } from "react";
import { map } from "es-toolkit/compat";
import { MessageSquarePlus, Plus } from "lucide-react";
import { Control, FieldArrayWithId } from "react-hook-form";

import { Button } from "@/components/shadcn/button";
import { DPromptUpdate } from "@/data/types/domain/prompt";

import { PromptFollowUpEdit } from "./prompt-follow-up-edit";

type PromptFollowUpsEditProps = {
   control: Control<DPromptUpdate>;
   followUpPrompts: FieldArrayWithId<DPromptUpdate, "followUpPrompts", "id">[];
   addFollowUpPrompt: (value: string) => void;
   removeFollowUpPrompt: (index: number) => void;
};

export const PromptFollowUpsEdit: FC<PromptFollowUpsEditProps> = ({
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
      return (
         <div className="space-y-4">
            {map(followUpPrompts, (_, idx) => (
               <PromptFollowUpEdit
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
               data-testid="add-btn"
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
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
               <MessageSquarePlus className="h-5 w-5 text-indigo-600" />
               Folge-Prompts
            </h3>
            <p className="mt-1 text-sm text-slate-500">
               Vorgeschlagene Prompts, die du als nächste stellen könntest.
            </p>
         </div>
         {prompts()}
         {addBtn()}
      </section>
   );
};

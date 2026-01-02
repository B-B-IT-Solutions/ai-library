"use client";

import { FC, useState } from "react";
import { X } from "lucide-react";

import { PromptFormEdit } from "@/components/prompts/prompt";
import { TemplateSelector } from "@/components/prompts/template";
import { DPrompt } from "@/data/types/domain/prompt";
import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";

type PromptCreateEditProps = {
   prompt?: DPrompt;
};

export const PromptCreateEdit: FC<PromptCreateEditProps> = ({ prompt }) => {
   const [isEditing, setIsEditing] = useState(false);
   const [template, setTemplate] = useState<
      DPromptTemplateDescriptor | undefined
   >();

   const editForm = () => {
      return (
         <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            {isEditing && (
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">
                     {prompt ? "Update Prompt" : "Create New Prompt"}
                  </h2>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                     <X className="w-5 h-5 text-slate-600" />
                  </button>
               </div>
            )}

            {/* Template Selector */}
            {!prompt && <TemplateSelector onSelect={setTemplate} />}
            <PromptFormEdit prompt={prompt} />
         </div>
      );
   };

   return (
      <div
         className="h-full rounded-lg bg-slate-50 text-slate-900 flex"
         data-testid="prompt-create-edit"
      >
         <div className="flex-1 p-6">{editForm()}</div>
      </div>
   );
};

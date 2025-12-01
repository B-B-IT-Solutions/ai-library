"use client";

import { FC, useState } from "react";
import { X } from "lucide-react";

import { PromptFom } from "@/components/prompts/prompt";
import { TemplateSelector } from "@/components/prompts/template";
import { DPrompt } from "@/data/types/domain/prompt";
import { DPromptTemplate } from "@/data/types/domain/prompt.template";

type PromptManagerProps = {
   prompt: DPrompt;
};

export const PromptManager: FC<PromptManagerProps> = ({ prompt }) => {
   const [selectedPrompt, setSelectedPrompt] = useState<DPrompt | undefined>(
      prompt
   );
   const [isEditing, setIsEditing] = useState(false);

   const resetForm = () => {};

   const loadTemplate = (template: DPromptTemplate) => {};

   const editForm = () => {
      return (
         <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            {isEditing && (
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">
                     {selectedPrompt ? "Update Prompt" : "Create New Prompt"}
                  </h2>
                  <button
                     onClick={resetForm}
                     className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                     <X className="w-5 h-5 text-slate-600" />
                  </button>
               </div>
            )}

            {/* Template Selector */}
            {!selectedPrompt && <TemplateSelector onSelect={loadTemplate} />}
            <PromptFom prompt={selectedPrompt} />
         </div>
      );
   };

   return (
      <div
         className="h-full rounded-lg bg-slate-50 text-slate-900 flex"
         data-testid="prompt-manager"
      >
         <div className="flex-1 p-6">{editForm()}</div>
      </div>
   );
};

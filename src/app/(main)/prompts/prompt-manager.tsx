"use client";

import { FC, useState } from "react";
import { Plus, X } from "lucide-react";

import { DPrompt, DPromptCreate } from "@/data/types/domain/prompt";
import { DPromptTemplate } from "@/data/types/domain/prompt.template";

import { PromptFom } from "./prompt/prompt-form";
import { TemplateSelector } from "./template/template-selector";

type PromptManagerProps = {
   prompt?: DPrompt;
};

export const PromptManager: FC<PromptManagerProps> = ({ prompt }) => {
   const [selectedPrompt, setSelectedPrompt] = useState<DPrompt | undefined>(
      prompt
   );
   const [isEditing, setIsEditing] = useState(false);

   const [formData, setFormData] = useState<DPromptCreate>({
      title: "",
      content: "",
      categories: [],
      recommendedModel: "",
      followUpPrompts: [],
   });

   const resetForm = () => {
      setFormData({
         title: "",
         content: "",
         categories: [],
         recommendedModel: "",
         followUpPrompts: [],
      });
      setIsEditing(false);
      setSelectedPrompt(null);
   };

   const loadTemplate = (template: DPromptTemplate) => {
      setFormData({
         title: template.title,
         content: template.content,
         categories: [],
         recommendedModel: template.recommendedModel || "",
         followUpPrompts: [],
      });
   };

   return (
      <div
         className="min-h-screen rounded-lg bg-slate-50 text-slate-900 flex"
         data-testid="prompt-manager"
      >
         <div className="flex-1 p-6">
            {selectedPrompt || isEditing ? (
               /* Edit/Create Form */
               <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                  {isEditing && (
                     <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">
                           {selectedPrompt
                              ? "Update Prompt"
                              : "Create New Prompt"}
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
                  {!selectedPrompt && (
                     <TemplateSelector onSelect={loadTemplate} />
                  )}
                  <PromptFom prompt={selectedPrompt} />
               </div>
            ) : (
               /* Empty State */
               <div className="bg-white rounded-lg p-12 border border-slate-200 shadow-sm text-center">
                  <div className="text-slate-500 mb-4">
                     <Plus className="w-16 h-16 mx-auto mb-4 opacity-50" />
                     <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        No Prompt Selected
                     </h3>
                     <p>
                        Select a prompt from the list or create a new one to get
                        started
                     </p>
                  </div>
                  <button
                     onClick={() => {
                        resetForm();
                        setIsEditing(true);
                     }}
                     className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                  >
                     Create Your First Prompt
                  </button>
               </div>
            )}
         </div>
      </div>
   );
};

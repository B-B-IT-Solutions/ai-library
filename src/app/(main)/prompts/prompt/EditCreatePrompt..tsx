import { FC, useState } from "react";
import { X } from "lucide-react";

import { DPromptCreate, DPromptTemplate } from "@/data/types/domain/prompt";
import { TemplateSelector } from "../template/template-selector";

const AI_MODELS = [
   "Claude Sonnet 4.5",
   "Claude Opus 4",
   "GPT-4",
   "GPT-4 Turbo",
   "GPT-3.5",
   "Gemini Pro",
   "Gemini Ultra",
   "Llama 3",
   "Mistral Large",
   "Other",
];

type EditCreatePromptProps = {
   selectedPrompt: DPromptCreate;
   showTemplates: boolean;
   setShowTemplates: (value: boolean) => void;
   search: string;
   category: string;
   setSearch: (value: string) => void;
   setCategory: (value: string) => void;
   categories: string[];
   templates: DPromptTemplate[];
   onSelect: (template: DPromptTemplate) => void;
};

export const EditCreatePrompt: FC<EditCreatePromptProps> = ({
   selectedPrompt,
   showTemplates,
   setShowTemplates,
   search: templateSearch,
   setSearch: setTemplateSearch,
   category: templateCategory,
   setCategory: setTemplateCategory,
   categories: templateCategories,
   templates,
   onSelect,
}) => {
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
      //   setIsEditing(false);
      //   setSelectedPrompt(null);
      setShowTemplates(false);
      setTemplateSearch("");
      setTemplateCategory("all");
   };

   const addCategory = (cat: string) => {
      if (cat && !formData.categories.includes(cat)) {
         setFormData((prev) => ({
            ...prev,
            categories: [...prev.categories, cat],
         }));
      }
   };

   const removeCategory = (cat: string) => {
      setFormData((prev) => ({
         ...prev,
         categories: prev.categories.filter((c) => c !== cat),
      }));
   };

   const addFollowUpPrompt = () => {
      const input = document.getElementById("newFollowUp");
      if (input && input.value.trim()) {
         setFormData((prev: string) => ({
            ...prev,
            followUpPrompts: [...prev.followUpPrompts, input.value.trim()],
         }));
         input.value = "";
      }
   };

   const removeFollowUpPrompt = (index: number) => {
      setFormData((prev: string) => ({
         ...prev,
         followUpPrompts: prev.followUpPrompts.filter((_, i) => i !== index),
      }));
   };

   return (
      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
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

         {/* Template Selector */}
         {!selectedPrompt && (
            <TemplateSelector
               showTemplates={showTemplates}
               setShowTemplates={setShowTemplates}
               search={templateSearch}
               setSearch={setTemplateSearch}
               category={templateCategory}
               setCategory={setTemplateCategory}
               categories={templateCategories}
               templates={templates}
               onSelect={onSelect}
            />
         )}

         <div className="space-y-4">
            <div>
               <label className="block text-sm font-medium mb-2 text-slate-700">
                  Title
               </label>
               <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                     setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                     }))
                  }
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter prompt title..."
               />
            </div>

            <div>
               <label className="block text-sm font-medium mb-2 text-slate-700">
                  Categories
               </label>
               <div className="flex gap-2 mb-2 flex-wrap">
                  {formData.categories.map((cat) => (
                     <span
                        key={cat}
                        className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm border border-slate-200"
                     >
                        {cat}
                        <button
                           onClick={() => removeCategory(cat)}
                           className="hover:text-slate-900"
                        >
                           <X className="w-3 h-3" />
                        </button>
                     </span>
                  ))}
               </div>
               <div className="flex gap-2">
                  <input
                     type="text"
                     id="newCategory"
                     placeholder="Add category..."
                     className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     onKeyPress={(e) => {
                        if (e.key === "Enter") {
                           addCategory(e.target.value);
                           e.target.value = "";
                        }
                     }}
                  />
                  <button
                     onClick={() => {
                        const input = document.getElementById("newCategory");
                        addCategory(input.value);
                        input.value = "";
                     }}
                     className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                  >
                     Add
                  </button>
               </div>
            </div>

            <div>
               <label className="block text-sm font-medium mb-2 text-slate-700">
                  Recommended AI Model
               </label>
               <select
                  value={formData.recommendedModel}
                  onChange={(e) =>
                     setFormData((prev) => ({
                        ...prev,
                        recommendedModel: e.target.value,
                     }))
                  }
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               >
                  <option value="">Select a model (optional)</option>
                  {AI_MODELS.map((model) => (
                     <option key={model} value={model}>
                        {model}
                     </option>
                  ))}
               </select>
            </div>

            <div>
               <label className="block text-sm font-medium mb-2 text-slate-700">
                  Prompt Content
               </label>
               <textarea
                  value={formData.content}
                  onChange={(e) =>
                     setFormData((prev) => ({
                        ...prev,
                        content: e.target.value,
                     }))
                  }
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-64 resize-none"
                  placeholder="Enter your prompt content..."
               />
            </div>

            <div>
               <label className="block text-sm font-medium mb-2 text-slate-700">
                  Follow-up Prompts
               </label>
               <p className="text-xs text-slate-500 mb-2">
                  Add suggested follow-up questions or prompts that users might
                  want to ask next.
               </p>
               {formData.followUpPrompts.length > 0 && (
                  <div className="mb-2 space-y-2">
                     {formData.followUpPrompts.map((prompt, idx) => (
                        <div
                           key={idx}
                           className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200"
                        >
                           <span className="flex-1 text-sm text-slate-700">
                              {prompt}
                           </span>
                           <button
                              onClick={() => removeFollowUpPrompt(idx)}
                              className="p-1 hover:bg-slate-200 rounded transition-colors"
                           >
                              <X className="w-4 h-4 text-slate-600" />
                           </button>
                        </div>
                     ))}
                  </div>
               )}
               <div className="flex gap-2">
                  <input
                     type="text"
                     id="newFollowUp"
                     placeholder="Add follow-up prompt..."
                     className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     onKeyPress={(e) => {
                        if (e.key === "Enter") {
                           addFollowUpPrompt();
                        }
                     }}
                  />
                  <button
                     onClick={addFollowUpPrompt}
                     className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                  >
                     Add
                  </button>
               </div>
            </div>

            <button
               onClick={selectedPrompt ? updatePrompt : createPrompt}
               className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
               <Save className="w-4 h-4" />
               {selectedPrompt ? "Save New Version" : "Create Prompt"}
            </button>
         </div>
      </div>
   );
};

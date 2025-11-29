import { FC, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import {
   useLoadPromptTemplateCategories,
   useLoadPromptTemplates,
} from "@/data/ts-queries/prompt";
import { DPromptTemplate } from "@/data/types/domain/prompt";

import { TemplateCards } from "./template-cards";
import { TemplateFilters } from "./template-filters";

type TemplateSelectorProps = {
   onSelect: (template: DPromptTemplate) => void;
};

export const TemplateSelector: FC<TemplateSelectorProps> = ({ onSelect }) => {
   const [showTemplates, setShowTemplates] = useState(false);
   const [templateSearch, setTemplateSearch] = useState("");
   const [templateCategory, setTemplateCategory] = useState("all");

   const { data: templates = [] } = useLoadPromptTemplates();
   const { data: categories = [] } = useLoadPromptTemplateCategories();

   const showButton = () => {
      return (
         <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="w-full flex items-center justify-between text-left"
            data-testid="show-templates-btn"
         >
            <span className="font-medium text-blue-900">
               {showTemplates ? "📋 Hide Templates" : "📋 Start from Template"}
            </span>
            {showTemplates ? (
               <ChevronDown className="w-5 h-5 text-blue-900" />
            ) : (
               <ChevronRight className="w-5 h-5 text-blue-900" />
            )}
         </button>
      );
   };

   const templatesView = () => {
      if (showTemplates) {
         return (
            <div className="mt-4 space-y-4" data-testid="templates-view">
               <TemplateFilters
                  search={templateSearch}
                  setSearch={setTemplateSearch}
                  category={templateCategory}
                  setCategory={setTemplateCategory}
                  categories={categories}
               />

               <TemplateCards
                  templates={templates}
                  onSelect={(template) => {
                     onSelect(template);
                     setShowTemplates(false);
                     setTemplateSearch("");
                     setTemplateCategory("all");
                  }}
               />
            </div>
         );
      }
   };

   return (
      <div
         className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
         data-testid="template-selector"
      >
         {showButton()}
         {templatesView()}
      </div>
   );
};

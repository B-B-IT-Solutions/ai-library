"use client";

import { FC, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import {
   useLoadPromptTemplateCategories,
   useLoadPromptTemplates,
} from "@/data/ts-queries/prompt";
import { DPromptTemplate } from "@/data/types/domain/prompt.template";

import { TemplateCards } from "./template-cards";
import { TemplateFilters } from "./template-filters";

type TemplateSelectorProps = {
   onSelect: (template: DPromptTemplate) => void;
};

export const TemplateSelector: FC<TemplateSelectorProps> = ({ onSelect }) => {
   const [showTemplates, setShowTemplates] = useState(false);
   const [search, setSearch] = useState("");
   const [categories, setCategories] = useState<string[]>([]);

   const { data: templates = [] } = useLoadPromptTemplates({
      search,
      categories,
   });

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
                  search={search}
                  setSearch={setSearch}
                  categories={categories}
                  setCategories={setCategories}
               />

               <TemplateCards
                  templates={templates}
                  onSelect={(template) => {
                     onSelect(template);
                     setShowTemplates(false);
                     setSearch("");
                     setCategories([]);
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

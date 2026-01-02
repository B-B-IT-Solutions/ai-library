"use client";

import { FC, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { useLoadPromptTemplates } from "@/data/ts-queries/prompt";
import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";

import { TemplateCards } from "./template-cards";
import { Filters, TemplateFilters } from "./template-filters";

type TemplateSelectorProps = {
   onSelect: (template: DPromptTemplateDescriptor) => void;
};

export const TemplateSelector: FC<TemplateSelectorProps> = ({ onSelect }) => {
   const [showTemplates, setShowTemplates] = useState(false);
   const [filters, setFilters] = useState<Filters>({});

   const { data: templates = [] } = useLoadPromptTemplates({
      search: filters.search,
      categories: filters.categories,
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
               <TemplateFilters onFiltersUpdate={setFilters} />

               <TemplateCards
                  templates={templates}
                  onSelect={(template) => {
                     onSelect(template);
                     setShowTemplates(false);
                     setFilters({});
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

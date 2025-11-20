import { ChevronDown, ChevronRight } from "lucide-react";
import { FC } from "react";
import { TemplateFilters } from "./TemplateFilters";
import { TemplateCards } from "./TemplateCards";
import { DPromptTemplate } from "@/data/domain/prompt";

type TemplateSelectorProps = {
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

export const TemplateSelector: FC<TemplateSelectorProps> = ({
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
   return (
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
         <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="w-full flex items-center justify-between text-left"
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

         {showTemplates && (
            <div className="mt-4 space-y-4">
               {/* Template Filters */}
               <TemplateFilters
                  search={templateSearch}
                  setSearch={setTemplateSearch}
                  category={templateCategory}
                  setCategory={setTemplateCategory}
                  categories={templateCategories}
               />

               {/* Template Grid */}
               <TemplateCards templates={templates} onSelect={onSelect} />
            </div>
         )}
      </div>
   );
};

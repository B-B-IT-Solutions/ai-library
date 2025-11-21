import { DPromptTemplate } from "@/data/domain/prompt";
import { FC } from "react";
import { TemplateCard } from "./template-card";

type TemplateCardsProps = {
   templates: DPromptTemplate[];
   onSelect: (template: DPromptTemplate) => void;
};

export const TemplateCards: FC<TemplateCardsProps> = ({
   templates,
   onSelect,
}) => {
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
         {templates.length > 0 ? (
            templates.map((template, idx) => (
               <TemplateCard
                  key={idx}
                  template={template}
                  onSelect={onSelect}
               />
            ))
         ) : (
            <div className="col-span-2 text-center py-8 text-slate-500">
               No templates match your filters
            </div>
         )}
      </div>
   );
};

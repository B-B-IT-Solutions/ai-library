import { FC } from "react";
import { isEmpty, map } from "es-toolkit/compat";

import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";

import { TemplateCard } from "./template-card";

type TemplateCardsProps = {
   templates: DPromptTemplateDescriptor[];
   onSelect: (template: DPromptTemplateDescriptor) => void;
};

export const TemplateCards: FC<TemplateCardsProps> = ({
   templates,
   onSelect,
}) => {
   const cards = () => {
      if (isEmpty(templates)) {
         return (
            <div
               className="col-span-2 text-center py-8 text-slate-500"
               data-testid="empty-templates"
            >
               No templates match your filters
            </div>
         );
      }
      return map(templates, (template, idx) => (
         <TemplateCard key={idx} template={template} onSelect={onSelect} />
      ));
   };

   return (
      <div
         className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto scrollbar-thin"
         data-testid="template-cards"
      >
         {cards()}
      </div>
   );
};

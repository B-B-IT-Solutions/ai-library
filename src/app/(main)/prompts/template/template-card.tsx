import { FC } from "react";
import { map } from "es-toolkit/compat";

import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { DPromptTemplate } from "@/data/domain/prompt";

type TemplateCardsProps = {
   template: DPromptTemplate;
   onSelect: (template: DPromptTemplate) => void;
};

export const TemplateCard: FC<TemplateCardsProps> = ({
   template,
   onSelect,
}) => {
   const tags = () => {
      const { categories, recommendedModel } = template;
      return (
         <div className="flex flex-wrap gap-1 mb-2" data-testid="tags">
            {map(categories, (cat) => (
               <span
                  key={cat.name}
                  className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200"
               >
                  {cat.name}
               </span>
            ))}
            {recommendedModel && (
               <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded border border-blue-200">
                  🤖 {recommendedModel}
               </span>
            )}
         </div>
      );
   };

   const content = () => {
      return (
         <p
            className="text-xs text-slate-600 line-clamp-3"
            data-testid="content"
         >
            {template.content}
         </p>
      );
   };

   return (
      <Card
         className="p-4 gap-0 bg-white border border-slate-300 rounded-lg text-left hover:border-blue-500 hover:shadow-md transition-all"
         onClick={() => onSelect(template)}
         data-testid="template-card"
      >
         <CardHeader className="p-0 gap-0 items-center">
            <h4 className="font-medium mb-2 text-slate-900">
               {template.title}
            </h4>
         </CardHeader>
         <CardContent className="p-0 grid gap-2">
            {tags()}
            {content()}
         </CardContent>
      </Card>
   );
};

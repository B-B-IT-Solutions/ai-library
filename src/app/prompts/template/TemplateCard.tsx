import { DPromptTemplate } from "@/data/domain/prompt";
import { FC } from "react";

type TempalteCardProps = {
   template: DPromptTemplate;
   onSelect: (template: DPromptTemplate) => void;
};

export const TempalteCard: FC<TempalteCardProps> = ({ template, onSelect }) => {
   return (
      <button
         onClick={() => onSelect(template)}
         className="p-4 bg-white border border-slate-300 rounded-lg text-left hover:border-blue-500 hover:shadow-md transition-all"
      >
         <h4 className="font-medium mb-2 text-slate-900">{template.title}</h4>
         <div className="flex flex-wrap gap-1 mb-2">
            {template.categories.map((cat) => (
               <span
                  key={cat}
                  className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200"
               >
                  {cat}
               </span>
            ))}
            {template.recommendedModel && (
               <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded border border-blue-200">
                  🤖 {template.recommendedModel}
               </span>
            )}
         </div>
         <p className="text-xs text-slate-600 line-clamp-2">
            {template.content}
         </p>
      </button>
   );
};

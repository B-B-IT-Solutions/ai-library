import { DPrompt } from "@/data/domain/prompt";
import { FC } from "react";

type TemplatesProps = {
   templateSearch: string;
   templateCategory: string;
};

export const Templates: FC<TemplatesProps> = ({
   templateSearch,
   templateCategory,
}) => {
   const PREDEFINED_PROMPTS: DPrompt[] = [];

   const filteredTemplates = PREDEFINED_PROMPTS.filter((template) => {
      const matchesSearch =
         template.title.toLowerCase().includes(templateSearch.toLowerCase()) ||
         template.content
            .toLowerCase()
            .includes(templateSearch.toLowerCase()) ||
         template.categories.some((cat) =>
            cat.toLowerCase().includes(templateSearch.toLowerCase())
         );
      const matchesCategory =
         templateCategory === "all" ||
         template.categories.includes(templateCategory);
      return matchesSearch && matchesCategory;
   });
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
         {filteredTemplates.length > 0 ? (
            filteredTemplates.map((template, idx) => (
               <button
                  key={idx}
                  onClick={() => loadTemplate(template)}
                  className="p-4 bg-white border border-slate-300 rounded-lg text-left hover:border-blue-500 hover:shadow-md transition-all"
               >
                  <h4 className="font-medium mb-2 text-slate-900">
                     {template.title}
                  </h4>
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
            ))
         ) : (
            <div className="col-span-2 text-center py-8 text-slate-500">
               No templates match your filters
            </div>
         )}
      </div>
   );
};

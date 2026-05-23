import { format } from "date-fns";
import { de } from "date-fns/locale";
import { isEmpty, map } from "es-toolkit/compat";

import { MDRenderer } from "@/components/shared/md";
import { DPrompt, DPromptWithContent } from "@/data/types/domain/prompt";

import { PromptTextDisplay } from "./prompt-text-display";

type Props = {
   descriptor: DPrompt;
   template: DPromptWithContent;
};

export const TemplateViewForm = ({ descriptor, template }: Props) => {
   const createdAt = format(new Date(descriptor.createdAt), "d. MMMM yyyy", {
      locale: de,
   });

   const categories = () => {
      if (!isEmpty(descriptor.categories)) {
         return (
            <div className="mb-3 flex flex-wrap gap-2" data-testid="categories">
               {map(descriptor.categories, (cat) => (
                  <span
                     key={cat.name}
                     className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600"
                  >
                     {cat.name}
                  </span>
               ))}
            </div>
         );
      }
   };

   return (
      <div data-testid="template-view-form">
         {/* Hero block */}
         <div className="mb-8">
            {categories()}
            <h1 className="mb-2 text-3xl font-bold text-slate-900">
               {descriptor.title}
            </h1>
            <p className="text-sm text-slate-500">
               Erstellt {createdAt} · {descriptor.recommendedModel}
            </p>
         </div>

         {/* Description */}
         <div className="mb-8" data-testid="short-description">
            <div className="mb-3 border-t border-slate-200 pt-4">
               <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                  Beschreibung
               </span>
            </div>
            <MDRenderer>{descriptor.description}</MDRenderer>
         </div>

         {/* Prompt text */}
         <div className="border-t border-slate-200 pt-4">
            <PromptTextDisplay template={template} />
         </div>
      </div>
   );
};

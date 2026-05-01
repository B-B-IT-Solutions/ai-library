import { isEmpty, map } from "es-toolkit/compat";

import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { MDRenderer } from "@/components/shared/md";
import {
   DPromptTemplate,
   DPromptTemplateDescriptor,
} from "@/data/types/domain/prompt.template";

import { PromptTextDisplay } from "./prompt-text-display";

type Props = {
   descriptor: DPromptTemplateDescriptor;
   template: DPromptTemplate;
};

export const PublicTemplateView = ({ descriptor, template }: Props) => {
   const categories = () => {
      if (!isEmpty(descriptor.categories)) {
         return (
            <div className="mt-4 flex flex-wrap gap-2" data-testid="categories">
               {map(descriptor.categories, (cat) => (
                  <span
                     key={cat.name}
                     className="rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-xs text-slate-700"
                  >
                     {cat.name}
                  </span>
               ))}
            </div>
         );
      }
   };

   return (
      <div
         className="min-h-full bg-slate-50"
         data-testid="public-template-view"
      >
         <div className="mx-auto max-w-5xl px-6 py-8">
            <h1 className="mb-6 text-2xl font-bold text-slate-900">
               {descriptor.title}
            </h1>

            <Card data-testid="template-view-public-form">
               <CardHeader className="border-b border-slate-200">
                  <div className="flex items-start justify-between gap-4">
                     <span className="inline-block rounded-md border border-blue-200 bg-blue-100 px-3 py-1 text-sm text-blue-700">
                        {descriptor.recommendedModel}
                     </span>
                  </div>
                  {categories()}
               </CardHeader>

               <CardContent className="space-y-6 px-6">
                  <div data-testid="short-description">
                     <h2 className="text-xl font-semibold text-slate-900">
                        Beschreibung
                     </h2>
                     <MDRenderer>{descriptor.description}</MDRenderer>
                  </div>
                  <PromptTextDisplay template={template} />
               </CardContent>
            </Card>
         </div>
      </div>
   );
};

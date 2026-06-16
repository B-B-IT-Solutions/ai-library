import { isEmpty, map } from "es-toolkit/compat";
import { Bot, Tag } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { BreadcrumbLinkProps } from "@/components/shared/breadcrumbs";
import { MDRenderer } from "@/components/shared/md";
import { DCollection } from "@/data/types/domain/collection";
import { DPromptWithContent } from "@/data/types/domain/prompt";
import { PromptBreadcrumb } from "../../breadcrumbs";

import { PromptText } from "./form";

type Props = {
   prompt: DPromptWithContent;
   collection?: DCollection | null;
};

export const PublicPromptView = ({ prompt, collection }: Props) => {
   const hasCategories = !isEmpty(prompt.categories);
   const isCollection = !!collection?.publicToken;

   const breadcrumbRoot: BreadcrumbLinkProps = {
      href: isCollection
         ? `/preview/collections/${collection.publicToken}`
         : "/preview/marketplace",
      label: isCollection ? collection.name : "Bibliothek",
   };

   return (
      <div className="bg-slate-50" data-testid="public-prompt-view">
         {/* Page header */}
         <div className="border-b bg-white">
            <div className="container mx-auto max-w-5xl px-4 py-6">
               <div className="mb-4">
                  <PromptBreadcrumb
                     variant="view"
                     label={prompt.title}
                     root={breadcrumbRoot}
                  />
               </div>
               <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  {prompt.title}
               </h1>
               <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                     <Bot className="h-3.5 w-3.5" />
                     {prompt.recommendedModel}
                  </span>
                  {hasCategories &&
                     map(prompt.categories, (cat) => (
                        <span
                           key={cat.name}
                           className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm text-slate-600"
                        >
                           <Tag className="h-3 w-3" />
                           {cat.name}
                        </span>
                     ))}
               </div>
            </div>
         </div>

         {/* Content */}
         <div className="container mx-auto max-w-5xl px-4 py-8">
            <Card className="shadow-sm" data-testid="template-view-public-form">
               <CardHeader className="border-b border-slate-100 pb-5">
                  <h2 className="text-lg font-semibold text-slate-900">
                     Beschreibung
                  </h2>
                  <div className="prose prose-slate max-w-none text-slate-600">
                     <MDRenderer>{prompt.description}</MDRenderer>
                  </div>
               </CardHeader>

               <CardContent className="pt-6">
                  <PromptText prompt={prompt} />
               </CardContent>
            </Card>
         </div>
      </div>
   );
};

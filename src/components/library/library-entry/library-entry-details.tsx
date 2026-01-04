import { FC } from "react";
import { isEmpty, map } from "es-toolkit/compat";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { MarkdownRenderer } from "@/components/shared/markdown-renderer";
import { DLibraryEntryWithPromptTemplate } from "@/data/types/domain/library";
import { CreatePromptButton } from "../buttons/create-prompt-button";
import { DownloadTemplateButton } from "../buttons/download-template-button";

import { PromptTextDisplay } from "./prompt-text-display";

type LibraryEntryDetailsProps = {
   entry: DLibraryEntryWithPromptTemplate;
};

export const LibraryEntryDetails: FC<LibraryEntryDetailsProps> = ({
   entry,
}) => {
   const { templateDescriptor: descriptor } = entry;

   const categories = () => {
      if (!isEmpty(descriptor.categories)) {
         return (
            <div className="flex flex-wrap gap-2 mt-4" data-testid="categories">
               {map(descriptor.categories, (cat) => (
                  <span
                     key={cat.name}
                     className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200"
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
         className="container mx-auto px-4 py-8"
         data-testid="library-entry-details"
      >
         <div className="mb-6">
            <Link
               href="/library"
               className="inline-flex items-center text-slate-600 hover:text-slate-900"
            >
               <ArrowLeft className="w-4 h-4 mr-2" />
               Zurück zur Bibliothek
            </Link>
         </div>

         <div className="max-w-4xl mx-auto">
            <Card className="bg-white border border-slate-300 rounded-lg">
               <CardHeader className="border-b border-slate-200">
                  <div className="flex items-start justify-between">
                     <div className="flex-1">
                        <h1 className="text-3xl font-bold text-slate-900 mb-3">
                           {descriptor.title}
                        </h1>
                        <span className="inline-block text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-md border border-blue-200">
                           {descriptor.recommendedModel}
                        </span>
                     </div>
                  </div>
                  {categories()}
               </CardHeader>

               <CardContent className="p-6 space-y-6">
                  <div data-testid="short-description">
                     <h2 className="text-xl font-semibold text-slate-900 mb-3">
                        Beschreibung
                     </h2>
                     <MarkdownRenderer content={descriptor.description} />
                  </div>

                  <div data-testid="long-description">
                     <h2 className="text-xl font-semibold text-slate-900 mb-3">
                        Detaillierte Beschreibung
                     </h2>
                     <MarkdownRenderer
                        content={descriptor.promptTemplate.detailedDescription}
                     />
                  </div>

                  <PromptTextDisplay template={descriptor.promptTemplate} />

                  <div className="flex gap-3 pt-4 border-t border-slate-200">
                     <CreatePromptButton descriptor={descriptor} />
                     <DownloadTemplateButton descriptor={descriptor} />
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
};

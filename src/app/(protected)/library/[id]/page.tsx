import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { PromptTextDisplay } from "@/components/library/prompt-text-display";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { MarkdownRenderer } from "@/components/shared/markdown-renderer";
import { getLibraryEntryByTemplateId } from "@/data/actions/library/library.actions";

import { TemplateActions } from "./template-actions";

type PageProps = {
   params: Promise<{
      id: string;
   }>;
};

export default async function LibraryDetailPage({ params }: PageProps) {
   const session = await auth();
   if (!session?.user?.id) {
      return redirect("/");
   }

   const { id } = await params;
   const result = await getLibraryEntryByTemplateId(id);

   if (!result.success || !result.data) {
      return notFound();
   }

   const { template } = result.data;

   return (
      <div className="container mx-auto px-4 py-8">
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
                           {template.title}
                        </h1>
                        <span className="inline-block text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded border border-blue-200">
                           🤖 {template.recommendedModel}
                        </span>
                     </div>
                  </div>

                  {template.categories && template.categories.length > 0 && (
                     <div className="flex flex-wrap gap-2 mt-4">
                        {template.categories.map((cat) => (
                           <span
                              key={cat.name}
                              className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded border border-slate-200"
                           >
                              {cat.name}
                           </span>
                        ))}
                     </div>
                  )}
               </CardHeader>

               <CardContent className="p-6 space-y-6">
                  <div>
                     <h2 className="text-xl font-semibold text-slate-900 mb-3">
                        Beschreibung
                     </h2>
                     <MarkdownRenderer content={template.description} />
                  </div>

                  {template.detailedDescription && (
                     <div>
                        <h2 className="text-xl font-semibold text-slate-900 mb-3">
                           Detaillierte Beschreibung
                        </h2>
                        <MarkdownRenderer
                           content={template.detailedDescription}
                        />
                     </div>
                  )}

                  {template.promptText && (
                     <PromptTextDisplay content={template.promptText} />
                  )}

                  <div className="flex gap-3 pt-4 border-t border-slate-200">
                     <TemplateActions templateId={template.id} />
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}

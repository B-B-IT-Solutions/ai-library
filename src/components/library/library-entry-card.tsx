"use client";

import { FC, useTransition } from "react";
import { map } from "es-toolkit/compat";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import {
   copyTemplateToPrompts,
   downloadTemplate,
} from "@/data/actions/library/library.actions";
import { DPromptTemplate } from "@/data/types/domain/prompt.template";

type LibraryEntryCardProps = {
   template: DPromptTemplate;
};

export const LibraryEntryCard: FC<LibraryEntryCardProps> = ({ template }) => {
   const [isCopying, startCopyTransition] = useTransition();
   const [isDownloading, startDownloadTransition] = useTransition();

   const handleCopy = () => {
      startCopyTransition(async () => {
         const result = await copyTemplateToPrompts(template.id);
         if (result.success) {
            toast.success(result.message);
         } else {
            toast.error(result.message);
         }
      });
   };

   const handleDownload = () => {
      startDownloadTransition(async () => {
         const result = await downloadTemplate(template.id);
         if (result.success && result.data) {
            // Create download
            const blob = new Blob([result.data], {
               type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${template.title.replace(/\s+/g, "_")}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success("Template downloaded!");
         } else {
            toast.error(result.message);
         }
      });
   };

   const categories = () => {
      return (
         <div className="flex flex-wrap gap-1 mb-2" data-testid="categories">
            {map(template.categories, (cat) => (
               <span
                  key={cat.name}
                  className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200"
               >
                  {cat.name}
               </span>
            ))}
         </div>
      );
   };

   return (
      <Card
         className="p-4 gap-0 bg-white border border-slate-300 rounded-lg"
         data-testid="purchased-template-card"
      >
         <CardHeader className="p-0 gap-2 mb-3">
            <h4 className="font-medium text-slate-900">{template.title}</h4>
            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded border border-blue-200 self-start">
               🤖 {template.recommendedModel}
            </span>
         </CardHeader>
         <CardContent className="p-0 grid gap-3">
            {categories()}
            <p className="text-sm text-slate-600 line-clamp-3">
               {template.content}
            </p>

            <div className="flex gap-2 mt-2">
               <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  disabled={isCopying}
                  data-testid="copy-button"
               >
                  <Copy className="w-4 h-4 mr-1" />
                  {isCopying ? "Copying..." : "Copy"}
               </Button>
               <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  data-testid="download-button"
               >
                  <Download className="w-4 h-4 mr-1" />
                  Download
               </Button>
            </div>
         </CardContent>
      </Card>
   );
};

"use client";

import { FC, useTransition } from "react";
import { map } from "es-toolkit/compat";
import { ArrowRight, Download, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import {
   copyTemplateToPrompts,
   downloadTemplate,
} from "@/data/actions/library/library.actions";
import { DLibraryEntry } from "@/data/types/domain/library";

type LibraryEntryCardProps = {
   entry: DLibraryEntry;
};

export const LibraryEntryCard: FC<LibraryEntryCardProps> = ({ entry }) => {
   const { template } = entry;
   const [isCopying, startCopyTransition] = useTransition();
   const [isDownloading, startDownloadTransition] = useTransition();

   const handleCopyToPrompts = () => {
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
         className="group p-0 gap-0 bg-white border border-slate-300 rounded-lg hover:border-slate-400 hover:shadow-md transition-all duration-200"
         data-testid="purchased-template-card"
      >
         <CardHeader className="p-5 pb-3 gap-3 border-b border-slate-200">
            <Link href={`/library/${template.id}`} className="group/title">
               <h4 className="font-semibold text-lg text-slate-900 leading-tight hover:text-blue-700 transition-colors cursor-pointer">
                  {template.title}
               </h4>
            </Link>
            <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-200 self-start font-medium">
               🤖 {template.recommendedModel}
            </span>
         </CardHeader>

         <CardContent className="p-5 grid gap-4">
            {categories()}
            <p className="text-sm text-slate-700 line-clamp-3 leading-relaxed">
               {template.description}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
               <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyToPrompts}
                  disabled={isCopying}
                  className="cursor-pointer hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors"
                  data-testid="create-prompt-button"
               >
                  <Plus className="w-4 h-4 mr-1.5" />
                  {isCopying ? "Erstellen..." : "Prompt erstellen"}
               </Button>
               <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="cursor-pointer hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  data-testid="download-button"
               >
                  <Download className="w-4 h-4 mr-1.5" />
                  {isDownloading ? "Laden..." : "Download"}
               </Button>
            </div>

            <Link href={`/library/${template.id}`} className="w-full">
               <Button
                  variant="default"
                  size="sm"
                  className="w-full cursor-pointer bg-slate-900 hover:bg-slate-800 text-white"
                  data-testid="view-details-button"
               >
                  Vollständige Details anzeigen
                  <ArrowRight className="w-4 h-4 ml-2" />
               </Button>
            </Link>
         </CardContent>
      </Card>
   );
};

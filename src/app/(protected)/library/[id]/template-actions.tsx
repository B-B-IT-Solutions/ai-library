"use client";

import { FC, useTransition } from "react";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import {
   copyTemplateToPrompts,
   downloadTemplate,
} from "@/data/actions/library/library.actions";

type TemplateActionsProps = {
   templateId: string;
};

export const TemplateActions: FC<TemplateActionsProps> = ({ templateId }) => {
   const [isCopying, startCopyTransition] = useTransition();
   const [isDownloading, startDownloadTransition] = useTransition();

   const handleCopy = () => {
      startCopyTransition(async () => {
         const result = await copyTemplateToPrompts(templateId);
         if (result.success) {
            toast.success(result.message);
         } else {
            toast.error(result.message);
         }
      });
   };

   const handleDownload = () => {
      startDownloadTransition(async () => {
         const result = await downloadTemplate(templateId);
         if (result.success && result.data) {
            const blob = new Blob([result.data], {
               type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `template_${templateId}.json`;
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

   return (
      <>
         <Button
            variant="outline"
            onClick={handleCopy}
            disabled={isCopying}
            className="cursor-pointer"
         >
            <Copy className="w-4 h-4 mr-2" />
            {isCopying ? "Kopieren..." : "In meine Prompts kopieren"}
         </Button>
         <Button
            variant="outline"
            onClick={handleDownload}
            disabled={isDownloading}
            className="cursor-pointer"
         >
            <Download className="w-4 h-4 mr-2" />
            {isDownloading ? "Herunterladen..." : "Als JSON herunterladen"}
         </Button>
      </>
   );
};

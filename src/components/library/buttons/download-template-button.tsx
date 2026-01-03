"use client";

import { FC, useTransition } from "react";
import { saveAs } from "file-saver";
import { Download, Loader } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { DropdownMenuItem } from "@/components/shadcn/dropdown-menu";
import { downloadTemplate } from "@/data/actions/library";
import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";

type DownloadTemplateButtonProps = {
   descriptor: DPromptTemplateDescriptor;
   asMenuItem?: boolean;
};

export const DownloadTemplateButton: FC<DownloadTemplateButtonProps> = ({
   descriptor,
   asMenuItem,
}) => {
   const [isPending, startTransition] = useTransition();

   const handleDownload = () => {
      startTransition(async () => {
         const result = await downloadTemplate(descriptor.id);
         if (result.success && result.data) {
            const blob = new Blob([result.data], {
               type: "application/json",
            });
            const fileName = `${descriptor.title.replace(/\s+/g, "_")}.json`;
            saveAs(blob, fileName);
            toast.success("Vorlage heruntergeladen!");
         } else {
            toast.error(result.message);
         }
      });
   };

   const label = () => {
      if (isPending) {
         return (
            <>
               <Loader className="w-4 h-4 mr-1.5 animate-spin" />
               <span>Herunterladen...</span>
            </>
         );
      }

      return (
         <>
            <Download className="w-4 h-4 mr-2" />
            <span>Herunterladen</span>
         </>
      );
   };

   if (asMenuItem) {
      return (
         <DropdownMenuItem
            onClick={handleDownload}
            disabled={isPending}
            className="cursor-pointer"
            data-testid="download-template-menu-item"
         >
            {label()}
         </DropdownMenuItem>
      );
   }

   return (
      <Button
         variant="outline"
         onClick={handleDownload}
         disabled={isPending}
         className="cursor-pointer"
         data-testid="download-template-btn"
      >
         {label()}
      </Button>
   );
};

"use client";

import { FC, useTransition } from "react";
import { Download, Loader } from "lucide-react";
import { toast } from "sonner";

import { DropdownMenuItem } from "@/components/shadcn/dropdown-menu";
import { downloadTemplate } from "@/data/actions/library";
import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";

type DownloadTemplateButtonProps = {
   descriptor: DPromptTemplateDescriptor;
};

export const DownloadTemplateButton: FC<DownloadTemplateButtonProps> = ({
   descriptor,
}) => {
   const [isPending, startTransition] = useTransition();

   const handleDownload = () => {
      startTransition(async () => {
         const result = await downloadTemplate(descriptor.id);
         if (result.success && result.data) {
            const blob = new Blob([result.data], {
               type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${descriptor.title.replace(/\s+/g, "_")}.json`;
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

   const label = () => {
      if (isPending) {
         return (
            <>
               <Loader className="w-4 h-4 mr-1.5 animate-spin" />
               <span>Herunterladen</span>
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

   return (
      <DropdownMenuItem
         onClick={handleDownload}
         disabled={isPending}
         className="cursor-pointer"
         data-testid="download-menu-item"
      >
         {label()}
      </DropdownMenuItem>
   );
};

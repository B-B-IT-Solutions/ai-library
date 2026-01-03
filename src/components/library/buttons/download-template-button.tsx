"use client";

import { FC, useTransition } from "react";
import { Download, Loader } from "lucide-react";
import { toast } from "sonner";

import { DropdownMenuItem } from "@/components/shadcn/dropdown-menu";
import { downloadTemplate } from "@/data/actions/library/library.actions";

type DownloadTemplateButtonProps = {
   templateId: string;
   templateTitle: string;
};

export const DownloadTemplateButton: FC<DownloadTemplateButtonProps> = ({
   templateId,
   templateTitle,
}) => {
   const [isPending, startTransition] = useTransition();

   const handleDownload = () => {
      startTransition(async () => {
         const result = await downloadTemplate(templateId);
         if (result.success && result.data) {
            const blob = new Blob([result.data], {
               type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${templateTitle.replace(/\s+/g, "_")}.json`;
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
      <DropdownMenuItem
         onClick={handleDownload}
         disabled={isPending}
         className="cursor-pointer"
         data-testid="download-menu-item"
      >
         {isPending ? (
            <Loader className="w-4 h-4 mr-2 animate-spin" />
         ) : (
            <Download className="w-4 h-4 mr-2" />
         )}
         Herunterladen
      </DropdownMenuItem>
   );
};

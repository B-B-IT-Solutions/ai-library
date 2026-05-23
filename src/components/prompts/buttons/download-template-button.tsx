"use client";

import { useTransition } from "react";
import { saveAs } from "file-saver";
import { Download, Loader } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { DropdownMenuItem } from "@/components/shadcn/dropdown-menu";
import { downloadPrompt } from "@/data/actions/prompt";
import { DPrompt } from "@/data/types/domain/prompt";

type Props = {
   descriptor: DPrompt;
   asMenuItem?: boolean;
   className?: string;
};

export const DownloadTemplateButton = ({
   descriptor,
   asMenuItem,
   className,
}: Props) => {
   const [isPending, startTransition] = useTransition();

   const handleDownload = () => {
      startTransition(async () => {
         const result = await downloadPrompt(descriptor.id);
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
               <Loader className="mr-1.5 h-4 w-4 animate-spin" />
               <span>Herunterladen...</span>
            </>
         );
      }

      return (
         <>
            <Download className="mr-2 h-4 w-4" />
            Herunterladen
         </>
      );
   };

   if (asMenuItem) {
      return (
         <DropdownMenuItem
            onClick={handleDownload}
            disabled={isPending}
            className="cursor-pointer hover:bg-accent"
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
         className={className ?? "cursor-pointer"}
         data-testid="download-template-btn"
      >
         {label()}
      </Button>
   );
};

"use client";

import { useState } from "react";
import { Maximize2, Minimize2, X } from "lucide-react";

import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/shadcn/dialog";
import { CallbackFn } from "@/data/types/common";
import { DPrompt, DPromptGenerationData } from "@/data/types/domain/prompt";
import { UseTemplateForm } from "../use-template/use-template-form";

type Props = {
   prompt: DPrompt;
   generationData: DPromptGenerationData;
   onCancel: CallbackFn;
};

export const UseTemplateDialog = ({
   prompt,
   generationData,
   onCancel,
}: Props) => {
   const [isExpanded, setIsExpanded] = useState(false);

   const expandBtn = () => {
      return (
         <button
            onClick={() => setIsExpanded((v) => !v)}
            className="absolute top-4 right-12 cursor-pointer rounded-sm bg-background px-2 py-2 hover:bg-accent"
            data-testid="expand-btn"
         >
            {isExpanded ? (
               <Minimize2 className="h-4 w-4" />
            ) : (
               <Maximize2 className="h-4 w-4" />
            )}
         </button>
      );
   };

   return (
      <Dialog
         open={true}
         onOpenChange={() => onCancel()}
         data-testid="use-template-dialog"
      >
         <DialogContent
            showCloseButton={false}
            className={`flex flex-col gap-0 overflow-hidden p-0 transition-all duration-200 ${
               isExpanded
                  ? "h-screen max-h-screen w-screen sm:max-w-none"
                  : "max-h-[90vh] sm:max-w-5xl"
            }`}
         >
            {expandBtn()}
            <DialogClose asChild={true}>
               <button
                  className="absolute top-4 right-4 cursor-pointer rounded-sm bg-background px-2 py-2 hover:bg-accent"
                  data-testid="close-btn"
               >
                  <X className="h-4 w-4" />
               </button>
            </DialogClose>
            <DialogHeader className="shrink-0 px-6 pt-6 pb-2">
               <DialogTitle>{prompt.title}</DialogTitle>
            </DialogHeader>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
               <UseTemplateForm
                  templateData={generationData}
                  recommendedModel={prompt.recommendedModel}
               />
            </div>
         </DialogContent>
      </Dialog>
   );
};

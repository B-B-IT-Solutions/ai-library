"use client";

import { useState } from "react";
import { Maximize2, Minimize2, X } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogTitle,
} from "@/components/shadcn/dialog";
import { CallbackFn } from "@/data/types/common";
import { DPrompt, DPromptGenerationData } from "@/data/types/domain/prompt";
import { UseTemplateForm } from "../use-prompt/use-prompt-form";

type Props = {
   prompt: DPrompt;
   generationData: DPromptGenerationData;
   onCancel: CallbackFn;
};

export const UsePromptDialog = ({
   prompt,
   generationData,
   onCancel,
}: Props) => {
   const [isExpanded, setIsExpanded] = useState(false);

   return (
      <Dialog
         open={true}
         onOpenChange={() => onCancel()}
         data-testid="use-prompt-dialog"
      >
         <DialogContent
            showCloseButton={false}
            className={`flex flex-col gap-0 overflow-hidden p-0 transition-all duration-200 ${
               isExpanded
                  ? "h-screen max-h-screen w-screen sm:max-w-none"
                  : "max-h-[90vh] sm:max-w-5xl"
            }`}
         >
            <div className="flex shrink-0 items-center gap-4 px-6 py-4">
               <div className="min-w-0 flex-1">
                  <DialogTitle className="truncate pb-1 text-base leading-tight font-semibold">
                     {prompt.title}
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground">
                     Platzhlater ausfüllen, dann in KI-Tool verwenden
                  </p>
               </div>
               <div className="flex shrink-0 items-center gap-1">
                  <Button
                     variant="ghost"
                     size="icon"
                     className="h-8 w-8 text-muted-foreground hover:text-foreground"
                     onClick={() => setIsExpanded((v) => !v)}
                     aria-label={isExpanded ? "Verkleinern" : "Vergrößern"}
                     data-testid="expand-btn"
                  >
                     {isExpanded ? (
                        <Minimize2 className="h-4 w-4" />
                     ) : (
                        <Maximize2 className="h-4 w-4" />
                     )}
                  </Button>
                  <div className="h-5 w-px bg-border" />
                  <DialogClose asChild={true}>
                     <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        aria-label="Schließen"
                        data-testid="close-btn"
                     >
                        <X className="h-4 w-4" />
                     </Button>
                  </DialogClose>
               </div>
            </div>
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

"use client";

import { AlertTriangle, Info } from "lucide-react";

import { UsePromptForm } from "@/components/prompt-templating/use-prompt/use-prompt-form";
import { CopyButton } from "@/components/shared/buttons";
import { MDRenderer } from "@/components/shared/md";
import { DPromptGenerationData } from "@/data/types/domain/prompt";
import { DWorkflowStep } from "@/data/types/domain/workflow";

type Props = {
   step: DWorkflowStep;
   templateData: DPromptGenerationData | null;
};

export const StepRenderer = ({ step, templateData }: Props) => {
   return (
      <div className="mx-auto max-w-3xl space-y-4">
         <h2 className="text-xl font-bold text-slate-900">{step.title}</h2>

         {step.hint && (
            <div className="flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
               <Info className="mt-0.5 h-4 w-4 shrink-0" />
               <span>{step.hint}</span>
            </div>
         )}

         {step.type === "PROMPT_REF" && (
            <>
               {templateData ? (
                  <UsePromptForm
                     templateData={templateData}
                     recommendedModel={templateData.template.recommendedModel}
                  />
               ) : (
                  <div className="flex items-start gap-2 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
                     <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                     Das verknüpfte Template wurde gelöscht. Dieser Schritt kann
                     nicht ausgeführt werden.
                  </div>
               )}
            </>
         )}

         {step.type === "STANDALONE" && step.content && (
            <div>
               <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                     Prompt-Text
                  </span>
                  <CopyButton
                     content={step.content}
                     variant="ghost"
                     size="sm"
                     showLabel
                  />
               </div>
               <div className="rounded-lg bg-slate-100 p-5">
                  <MDRenderer className="font-mono text-sm leading-relaxed text-slate-900">
                     {step.content}
                  </MDRenderer>
               </div>
            </div>
         )}
      </div>
   );
};

"use client";

import { AlertTriangle, Edit, Info } from "lucide-react";
import Link from "next/link";

import { UsePromptForm } from "@/components/prompt-templating/use-prompt/use-prompt-form";
import { Button } from "@/components/shadcn/button";
import { CopyButton } from "@/components/shared/buttons";
import { MDRenderer } from "@/components/shared/md";
import { DPromptGenerationData } from "@/data/types/domain/prompt";
import {
   DWorkflowStep,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";

type Props = {
   step: DWorkflowStep;
   templateData: DPromptGenerationData | null;
   workflow: DWorkflowWithSteps;
};

export const StepRenderer = ({ step, templateData, workflow }: Props) => {
   return (
      <div className="animate-in space-y-5 duration-200 fade-in-0 slide-in-from-bottom-2">
         <div className="space-y-3 rounded-xl border bg-card p-6">
            <h2 className="text-xl font-bold text-foreground">{step.title}</h2>
            {step.hint && (
               <div className="flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{step.hint}</span>
               </div>
            )}
         </div>

         {step.type === "PROMPT_REF" && (
            <>
               {templateData ? (
                  <UsePromptForm
                     templateData={templateData}
                     recommendedModel={templateData.template.recommendedModel}
                  />
               ) : (
                  <div className="space-y-3 rounded-xl border border-destructive/20 bg-destructive/5 p-5">
                     <div className="flex items-start gap-2 text-sm text-destructive">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span className="font-medium">
                           Template nicht verfügbar
                        </span>
                     </div>
                     <p className="text-sm text-muted-foreground">
                        Das verknüpfte Template wurde gelöscht. Dieser Schritt
                        kann nicht ausgeführt werden.
                     </p>
                     <Button variant="outline" size="sm" asChild>
                        <Link href={`/workflows/${workflow.id}/edit`}>
                           <Edit className="mr-2 h-4 w-4" />
                           Workflow bearbeiten
                        </Link>
                     </Button>
                  </div>
               )}
            </>
         )}

         {step.type === "STANDALONE" && step.content && (
            <div className="space-y-2">
               <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                     Prompt
                  </span>
                  <CopyButton
                     content={step.content}
                     variant="ghost"
                     size="sm"
                     showLabel
                  />
               </div>
               <div className="rounded-xl bg-muted p-5">
                  <MDRenderer className="font-mono text-sm leading-relaxed text-foreground">
                     {step.content}
                  </MDRenderer>
               </div>
            </div>
         )}
      </div>
   );
};

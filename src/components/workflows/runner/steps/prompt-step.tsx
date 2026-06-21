"use client";

import { AlertTriangle, Edit, Loader2 } from "lucide-react";
import Link from "next/link";

import { UsePromptForm } from "@/components/prompt-templating/use-prompt/use-prompt-form";
import { Button } from "@/components/shadcn/button";
import { useLoadPromptTemplatingData } from "@/data/ts-queries/prompt";
import {
   DWorkflowStep,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";

type Props = {
   step: DWorkflowStep;
   workflow: DWorkflowWithSteps;
};

export const PromptStep = ({ step, workflow }: Props) => {
   const { data: promptData, isPending } = useLoadPromptTemplatingData({
      promptId: step.promptId,
      enabled: !!step.promptId,
   });

   if (isPending) {
      return (
         <div
            className="flex items-center gap-2 p-5 text-sm text-muted-foreground"
            data-testid="prompt-step-loading"
         >
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Wird geladen…</span>
         </div>
      );
   }

   if (!promptData) {
      return (
         <div
            className="space-y-3 rounded-xl border border-destructive/20 bg-destructive/5 p-5"
            data-testid="prompt-step"
         >
            <div className="flex items-start gap-2 text-sm text-destructive">
               <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
               <span className="font-medium">Prompt nicht verfügbar</span>
            </div>
            <p className="text-sm text-muted-foreground">
               Das verknüpfte Prompt wurde gelöscht. Dieser Schritt kann nicht
               ausgeführt werden.
            </p>
            <Button variant="outline" size="sm" asChild>
               <Link href={`/workflows/${workflow.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Workflow bearbeiten
               </Link>
            </Button>
         </div>
      );
   }

   return (
      <div data-testid="prompt-step">
         <UsePromptForm
            promptData={promptData}
            recommendedModel={promptData.template.recommendedModel}
         />
      </div>
   );
};

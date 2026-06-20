"use client";

import { AlertTriangle, Edit } from "lucide-react";
import Link from "next/link";

import { UsePromptForm } from "@/components/prompt-templating/use-prompt/use-prompt-form";
import { Button } from "@/components/shadcn/button";
import { DPromptGenerationData } from "@/data/types/domain/prompt";
import { DWorkflowWithSteps } from "@/data/types/domain/workflow";

type Props = {
   promptData: DPromptGenerationData | null;
   workflow: DWorkflowWithSteps;
};

export const PromptStep = ({ promptData, workflow }: Props) => {
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

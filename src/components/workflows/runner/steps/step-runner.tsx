"use client";

import { Info } from "lucide-react";

import { DPromptGenerationData } from "@/data/types/domain/prompt";
import {
   DWorkflowStep,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";

import { PromptStep } from "./prompt-step";
import { StandaloneStep } from "./standalone-step";

type Props = {
   workflow: DWorkflowWithSteps;
   step: DWorkflowStep;
   promptData: DPromptGenerationData | null;
};

export const StepRunner = ({ step, promptData, workflow }: Props) => {
   return (
      <div
         className="animate-in space-y-5 duration-200 fade-in-0 slide-in-from-bottom-2"
         data-testid="step-runner"
      >
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
            <PromptStep promptData={promptData} workflow={workflow} />
         )}

         {step.type === "STANDALONE" && <StandaloneStep step={step} />}
      </div>
   );
};

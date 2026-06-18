"use client";

import { useState } from "react";

import { getPromptGenerationData } from "@/data/actions/prompt";
import { DPromptGenerationData } from "@/data/types/domain/prompt";
import { DWorkflowWithSteps } from "@/data/types/domain/workflow";

import { CompletedState } from "./completed-state";
import { NextStepButtons } from "./next-step-buttons";
import { RunnerBreadcrumb } from "./runner-breadcrumb";
import { RunnerEmptyState } from "./runner-empty-state";
import { RunnerHeader } from "./runner-header";
import { StepRenderer } from "./step-renderer";

type RunnerState = {
   historyStack: string[];
   currentIndex: number;
};

type TemplateDataCache = Record<string, DPromptGenerationData | null>;

type Props = {
   workflow: DWorkflowWithSteps;
   initialTemplateData?: TemplateDataCache;
   onClose?: () => void;
};

export const WorkflowRunner = ({
   workflow,
   initialTemplateData = {},
   onClose,
}: Props) => {
   const startStep = workflow.steps.find((s) => s.isStart);

   const [state, setState] = useState<RunnerState>(() => ({
      historyStack: startStep ? [startStep.edgeId] : [],
      currentIndex: 0,
   }));

   const [templateDataCache, setTemplateDataCache] =
      useState<TemplateDataCache>(initialTemplateData);

   const currentStepId = state.historyStack[state.currentIndex];
   const currentStep = workflow.steps.find((s) => s.edgeId === currentStepId);
   const outgoingEdges = currentStep?.outgoingEdges ?? [];
   const isCompleted = outgoingEdges.length === 0 && !!currentStep;
   const canGoBack = state.currentIndex > 0;

   const handleChooseEdge = async (toStepId: string) => {
      if (!templateDataCache[toStepId]) {
         const nextStep = workflow.steps.find((s) => s.edgeId === toStepId);
         if (nextStep?.type === "PROMPT_REF" && nextStep.promptId) {
            try {
               const data = await getPromptGenerationData(nextStep.promptId);
               setTemplateDataCache((prev) => ({ ...prev, [toStepId]: data }));
            } catch {
               // ignore
            }
         }
      }

      setState((prev) => {
         const newStack = prev.historyStack.slice(0, prev.currentIndex + 1);
         newStack.push(toStepId);
         return { historyStack: newStack, currentIndex: prev.currentIndex + 1 };
      });
   };

   const handleBack = () => {
      setState((prev) => ({
         ...prev,
         currentIndex: Math.max(0, prev.currentIndex - 1),
      }));
   };

   const handleRestart = () => {
      setState({
         historyStack: startStep ? [startStep.edgeId] : [],
         currentIndex: 0,
      });
   };

   if (workflow.steps.length === 0) {
      return (
         <RunnerEmptyState
            workflowId={workflow.id}
            message="Dieser Workflow enthält noch keine Schritte."
         />
      );
   }

   if (!startStep) {
      return (
         <RunnerEmptyState
            workflowId={workflow.id}
            message="Kein Startschritt definiert"
         />
      );
   }

   return (
      <div
         className="flex h-screen flex-col bg-background"
         data-testid="workflow-runner"
      >
         <RunnerHeader
            title={workflow.title}
            canGoBack={canGoBack}
            onBack={handleBack}
            onClose={onClose}
         />

         <RunnerBreadcrumb
            historyStack={state.historyStack}
            currentIndex={state.currentIndex}
            steps={workflow.steps}
         />

         <div className="flex-1 overflow-y-auto p-6">
            {currentStep ? (
               <StepRenderer
                  step={currentStep}
                  templateData={templateDataCache[currentStep.edgeId] ?? null}
               />
            ) : (
               <p className="text-muted-foreground">Schritt nicht gefunden.</p>
            )}
         </div>

         <div className="border-t bg-white px-6 py-4">
            {isCompleted ? (
               <CompletedState onRestart={handleRestart} onClose={onClose} />
            ) : (
               <NextStepButtons
                  edges={outgoingEdges}
                  steps={workflow.steps}
                  onChoose={handleChooseEdge}
               />
            )}
         </div>
      </div>
   );
};

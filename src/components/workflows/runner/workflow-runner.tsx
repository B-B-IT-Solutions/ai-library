"use client";

import { useEffect, useState } from "react";

import { getPromptGenerationData } from "@/data/actions/prompt";
import { DPromptGenerationData } from "@/data/types/domain/prompt";
import {
   DWorkflowStep,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";

import { CompletedState } from "./completed-state";
import { NextStepButtons } from "./next-step-buttons";
import { RunnerEmptyState } from "./runner-empty-state";
import { StepRenderer } from "./step-renderer";

type RunnerState = {
   historyStack: string[];
   currentIndex: number;
};

type TemplateDataCache = Record<string, DPromptGenerationData | null>;

type Props = {
   workflow: DWorkflowWithSteps;
};

export const WorkflowRunner = ({ workflow }: Props) => {
   const startStep = workflow.steps.find((s) => s.isStart);

   const [state, setState] = useState<RunnerState>(() => ({
      historyStack: startStep ? [startStep.edgeId] : [],
      currentIndex: 0,
   }));

   const [templateDataCache, setTemplateDataCache] =
      useState<TemplateDataCache>({});

   const currentStepId = state.historyStack[state.currentIndex];
   const currentStep = workflow.steps.find((s) => s.edgeId === currentStepId);
   const outgoingEdges = currentStep?.outgoingEdges ?? [];
   const isCompleted = outgoingEdges.length === 0 && !!currentStep;
   const canGoBack = state.currentIndex > 0;

   const loadStepData = async (nextStep?: DWorkflowStep) => {
      if (nextStep?.type === "PROMPT_REF" && nextStep.promptId) {
         try {
            const data = await getPromptGenerationData(nextStep.promptId);
            setTemplateDataCache((prev) => ({
               ...prev,
               [nextStep.edgeId]: data,
            }));
         } catch {
            // ignore
         }
      }
   };

   useEffect(() => {
      loadStepData(startStep);
   }, [startStep]);

   const handleChooseEdge = async (toEdgeId: string) => {
      if (!templateDataCache[toEdgeId]) {
         const nextStep = workflow.steps.find((s) => s.edgeId === toEdgeId);
         await loadStepData(nextStep);
      }

      setState((prev) => {
         const newStack = prev.historyStack.slice(0, prev.currentIndex + 1);
         newStack.push(toEdgeId);
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
         className="flex flex-col bg-background"
         data-testid="workflow-runner"
      >
         <div key={currentStepId} className="flex-1 overflow-y-auto p-6">
            {currentStep ? (
               <StepRenderer
                  step={currentStep}
                  templateData={templateDataCache[currentStep.edgeId] ?? null}
                  workflowId={workflow.id}
               />
            ) : (
               <p className="text-muted-foreground">Schritt nicht gefunden.</p>
            )}
         </div>

         <div className="border-t bg-background px-6 py-4">
            {isCompleted ? (
               <CompletedState
                  onRestart={handleRestart}
                  stepCount={state.currentIndex + 1}
               />
            ) : (
               <NextStepButtons
                  edges={outgoingEdges}
                  steps={workflow.steps}
                  onChoose={handleChooseEdge}
                  canGoBack={canGoBack}
                  onBack={handleBack}
               />
            )}
         </div>
      </div>
   );
};

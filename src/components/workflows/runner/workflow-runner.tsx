"use client";

import { useEffect, useState } from "react";

import { getPromptGenerationData } from "@/data/actions/prompt";
import { DPromptGenerationData } from "@/data/types/domain/prompt";
import {
   DWorkflowStep,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";

import { WorkflowNavigation } from "./navigation";
import { WorfklowCompleted, WorklowStepsEmpty } from "./states";
import { StepRenderer } from "./step-renderer";

type RunnerState = {
   currentEdgeId: string;
   previousEdgeIds: string[];
};

type TemplateDataCache = Record<string, DPromptGenerationData | null>;

type Props = {
   workflow: DWorkflowWithSteps;
};

export const WorkflowRunner = ({ workflow }: Props) => {
   const startStep = workflow.steps.find((s) => s.isStart);

   const [state, setState] = useState<RunnerState>(() => ({
      currentEdgeId: startStep?.edgeId ?? "",
      previousEdgeIds: [],
   }));

   const [templateDataCache, setTemplateDataCache] =
      useState<TemplateDataCache>({});

   const currentStep = workflow.steps.find(
      (s) => s.edgeId === state.currentEdgeId
   );
   const outgoingEdges = currentStep?.outgoingEdges ?? [];
   const isCompleted = outgoingEdges.length === 0 && !!currentStep;
   const canGoBack = state.previousEdgeIds.length > 0;

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

      setState((prev) => ({
         currentEdgeId: toEdgeId,
         previousEdgeIds: [...prev.previousEdgeIds, prev.currentEdgeId],
      }));
   };

   const handleBack = () => {
      setState((prev) => {
         const previousEdgeIds = [...prev.previousEdgeIds];
         const currentEdgeId = previousEdgeIds.pop() ?? prev.currentEdgeId;
         return { currentEdgeId, previousEdgeIds };
      });
   };

   const handleRestart = () => {
      setState({
         currentEdgeId: startStep?.edgeId ?? "",
         previousEdgeIds: [],
      });
   };

   if (workflow.steps.length === 0) {
      return (
         <WorklowStepsEmpty
            workflow={workflow}
            message="Dieser Workflow enthält noch keine Schritte."
         />
      );
   }

   if (!startStep) {
      return (
         <WorklowStepsEmpty
            workflow={workflow}
            message="Kein Startschritt definiert"
         />
      );
   }

   return (
      <div
         className="flex flex-col bg-background"
         data-testid="workflow-runner"
      >
         <div key={state.currentEdgeId} className="flex-1 overflow-y-auto p-6">
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
               <WorfklowCompleted
                  onRestart={handleRestart}
                  stepCount={state.previousEdgeIds.length + 1}
               />
            ) : (
               <WorkflowNavigation
                  edges={outgoingEdges}
                  allSteps={workflow.steps}
                  onChoose={handleChooseEdge}
                  canGoBack={canGoBack}
                  onBack={handleBack}
               />
            )}
         </div>
      </div>
   );
};

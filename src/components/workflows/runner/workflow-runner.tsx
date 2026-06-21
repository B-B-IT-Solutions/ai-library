"use client";

import {
   useCallback,
   useEffect,
   useMemo,
   useReducer,
   useRef,
   useState,
} from "react";

import { getPromptGenerationData } from "@/data/actions/prompt";
import { DPromptGenerationData } from "@/data/types/domain/prompt";
import {
   DWorkflowStep,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";

import { WorkflowNavigation } from "./navigation";
import { runnerReducer, RunnerState } from "./runner-state";
import { WorfklowCompleted, WorklowStepsEmpty } from "./states";
import { StepRunner } from "./steps";

type TemplateDataCache = Record<string, DPromptGenerationData | null>;

type Props = {
   workflow: DWorkflowWithSteps;
};

export const WorkflowRunner = ({ workflow }: Props) => {
   const startStep = useMemo(
      () => workflow.steps.find((s) => s.isStart),
      [workflow.steps]
   );

   const [state, dispatch] = useReducer(
      runnerReducer,
      undefined,
      () => new RunnerState(startStep?.edgeId ?? "")
   );

   const [templateDataCache, setTemplateDataCache] =
      useState<TemplateDataCache>({});
   const loadedEdgeIds = useRef(new Set<string>());

   const currentStep = workflow.steps.find(
      (s) => s.edgeId === state.currentEdgeId
   );
   const outgoingEdges = currentStep?.outgoingEdges ?? [];
   const isCompleted = outgoingEdges.length === 0 && !!currentStep;

   const loadStepData = useCallback(async (step?: DWorkflowStep) => {
      if (step?.type !== "PROMPT_REF" || !step.promptId) {
         return;
      }
      if (loadedEdgeIds.current.has(step.edgeId)) {
         return;
      }
      loadedEdgeIds.current.add(step.edgeId);
      try {
         const data = await getPromptGenerationData(step.promptId);
         setTemplateDataCache((prev) => ({ ...prev, [step.edgeId]: data }));
      } catch {
         loadedEdgeIds.current.delete(step.edgeId);
      }
   }, []);

   useEffect(() => {
      loadStepData(startStep);
   }, [startStep, loadStepData]);

   const handleNextStep = useCallback(
      async (toEdgeId: string) => {
         const nextStep = workflow.steps.find((s) => s.edgeId === toEdgeId);
         await loadStepData(nextStep);
         dispatch({ type: "ADVANCE", toEdgeId });
      },
      [workflow.steps, loadStepData]
   );

   const handlePreviousStep = useCallback(() => {
      dispatch({ type: "GO_BACK" });
   }, []);

   const handleRestart = useCallback(() => {
      dispatch({ type: "RESTART", startEdgeId: startStep?.edgeId ?? "" });
   }, [startStep]);

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
               <StepRunner
                  step={currentStep}
                  promptData={templateDataCache[currentStep.edgeId] ?? null}
                  workflow={workflow}
               />
            ) : (
               <p className="text-muted-foreground">Schritt nicht gefunden.</p>
            )}
         </div>

         <div className="border-t bg-background px-6 py-4">
            {isCompleted ? (
               <WorfklowCompleted
                  onRestart={handleRestart}
                  stepCount={state.stepCount}
               />
            ) : (
               <WorkflowNavigation
                  edges={outgoingEdges}
                  allSteps={workflow.steps}
                  onNextStep={handleNextStep}
                  onPreviousStep={handlePreviousStep}
                  previousEnabled={state.canGoBack}
               />
            )}
         </div>
      </div>
   );
};

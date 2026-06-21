"use client";

import { useCallback, useMemo, useReducer } from "react";
import { find, isEmpty } from "es-toolkit/compat";

import { DWorkflowWithSteps } from "@/data/types/domain/workflow";

import { WorkflowNavigation } from "./navigation";
import { runnerReducer, RunnerState } from "./runner-state";
import { WorfklowCompleted, WorklowStepsEmpty } from "./states";
import { StepRunner } from "./steps";

type Props = {
   workflow: DWorkflowWithSteps;
};

export const WorkflowRunner = ({ workflow }: Props) => {
   const startStep = useMemo(
      () => find(workflow.steps, (s) => s.isStart),
      [workflow.steps]
   );

   const [state, dispatch] = useReducer(
      runnerReducer,
      undefined,
      () => new RunnerState(startStep?.edgeId ?? "")
   );

   const handleNextStep = useCallback((toEdgeId: string) => {
      dispatch({ type: "ADVANCE", toEdgeId });
   }, []);

   const handlePreviousStep = useCallback(() => {
      dispatch({ type: "GO_BACK" });
   }, []);

   const handleRestart = useCallback(() => {
      dispatch({ type: "RESTART" });
   }, []);

   const currentStep = find(
      workflow.steps,
      (s) => s.edgeId === state.currentEdgeId
   );
   const outgoingEdges = currentStep?.outgoingEdges ?? [];

   const isCompleted = outgoingEdges.length === 0 && !!currentStep;

   if (isEmpty(workflow.steps)) {
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
            <StepRunner step={currentStep} workflow={workflow} />
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

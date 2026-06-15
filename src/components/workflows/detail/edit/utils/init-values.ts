import { map } from "es-toolkit/compat";

import {
   DWorkflowStep,
   DWorkflowStepUpdate,
   DWorkflowUpdate,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";

export const initWorkflow = (
   workflow?: DWorkflowWithSteps
): DWorkflowUpdate => {
   return {
      title: workflow?.title ?? "",
      description: workflow?.description ?? "",
      steps: map(workflow?.steps, initWorkflowStep),
   };
};

export const initWorkflowStep = (step?: DWorkflowStep): DWorkflowStepUpdate => {
   return {
      title: step?.title ?? "",
      hint: step?.hint ?? "",
      type: step?.type ?? "PROMPT_REF",
      promptId: step?.promptId,
      content: step?.content,
      isStart: step?.isStart ?? false,
      position: step?.position ?? 0,
      edges: map(step?.outgoingEdges, (e) => ({
         toStepId: e.toStepId,
         label: e.label,
         order: e.order,
      })),
   };
};

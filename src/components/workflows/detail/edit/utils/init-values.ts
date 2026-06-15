import { map } from "es-toolkit/compat";

import {
   DWorkflowStep,
   DWorkflowStepUpdate,
} from "@/data/types/domain/workflow";

export const initWorkflowStep = (step?: DWorkflowStep): DWorkflowStepUpdate => {
   return {
      title: step?.title ?? "",
      hint: step?.hint ?? "",
      type: step?.type ?? "PROMPT_REF",
      promptId: step?.promptId,
      content: step?.content,
      isStart: step?.isStart,
      position: step?.position,
      edges: map(step?.outgoingEdges, (e) => ({
         toStepId: e.toStepId,
         label: e.label,
         order: e.order,
      })),
   };
};

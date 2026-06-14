import { dtestData } from "@tests";
import { map } from "es-toolkit/compat";

import { DPromptUpdate, DPromptWithContent } from "@/data/types/domain/prompt";
import {
   DWorkflowStep,
   DWorkflowStepUpdate,
} from "@/data/types/domain/workflow";

import { initWorkflowStep } from "./init-values";

const expectedInitWorfklowStepExisting = (
   step: DWorkflowStep
): DWorkflowStepUpdate => {
   return {
      title: step?.title,
      hint: step?.hint,
      type: step?.type,
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

const expectedInitWorfklowStepNew: DWorkflowStepUpdate = {
   title: "",
   hint: "",
   type: "PROMPT_REF",
   edges: [],
};

describe("initWorkflowStep tests", () => {
   it("initWorkflowStep - new step test", () => {
      const initValue = initWorkflowStep();
      expect(initValue).toEqual(expectedInitWorfklowStepNew);
   });

   it("initWorkflowStep - existing step test", () => {
      const step = dtestData.dWorkflowStep();
      const initValues = initWorkflowStep(step);
      const expectedValues = expectedInitWorfklowStepExisting(step);
      expect(initValues).toEqual(expectedValues);
   });
});

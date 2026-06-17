jest.mock("uuid");

import { ctestData, dtestData, UuidV4MockedFunction } from "@tests";
import { map } from "es-toolkit/compat";
import { v4 as uuidv4 } from "uuid";

import {
   DWorkflowStep,
   DWorkflowStepUpdate,
} from "@/data/types/domain/workflow";

import { initWorkflowStep } from "./init-values";

const uuidv4Mock = uuidv4 as UuidV4MockedFunction;

const edgeId = ctestData.uuid();
uuidv4Mock.mockReturnValue(edgeId);

const expectedInitWorfklowStepExisting = (
   step: DWorkflowStep
): DWorkflowStepUpdate => {
   return {
      title: step?.title,
      hint: step?.hint,
      type: step.type,
      promptId: step.promptId,
      content: step.content,
      edgeId: step.edgeId,
      isStart: step.isStart,
      position: step.position,
      edges: map(step.outgoingEdges, (e) => ({
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
   edgeId: edgeId,
   isStart: false,
   position: 0,
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

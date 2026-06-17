import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";

import {
   WorkflowStepWithEdgesAndPrompt,
   WorkflowWithStepCount,
   WorkflowWithSteps,
} from "@/data/types/db/workflow";
import {
   DWorkflow,
   DWorkflowStep,
   DWorkflowStepEdge,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";
import { Workflow, WorkflowStepEdge } from "@/generated/prisma/client";

import {
   toDWorkflow,
   toDWorkflows,
   toDWorkflowStep,
   toDWorkflowStepEdge,
   toDWorkflowWithStepCount,
   toDWorkflowWithSteps,
} from "./workflow.mapper";

const toDWorkflowInternal = (w: Workflow): DWorkflow => {
   return {
      id: w.id,
      title: w.title,
      description: w.description,
      stepCount: 0,
      updatedAt: w.updatedAt.toISOString(),
      createdAt: w.createdAt.toISOString(),
   };
};

const toDWorkflowWithStepCountInternal = (
   w: WorkflowWithStepCount
): DWorkflow => {
   return {
      ...toDWorkflowInternal(w),
      stepCount: w._count.steps,
   };
};

const toDWorkflowStepEdgeInternal = (
   e: WorkflowStepEdge
): DWorkflowStepEdge => {
   return {
      id: e.id,
      fromStepId: e.fromStepId,
      toStepId: e.toStepId,
      label: e.label,
      order: e.order,
   };
};

const toDWorkflowStepInternal = (
   s: WorkflowStepWithEdgesAndPrompt
): DWorkflowStep => {
   return {
      id: s.id,
      workflowId: s.workflowId,
      title: s.title,
      hint: s.hint,
      type: s.type,
      promptId: s.promptId,
      promptTitle: s.prompt?.title ?? null,
      content: s.content,
      edgeId: s.edgeId,
      isStart: s.isStart,
      position: s.position,
      outgoingEdges: map(s.outgoingEdges, toDWorkflowStepEdgeInternal),
   };
};

const toDWorkflowWithStepsInternal = (
   w: WorkflowWithSteps
): DWorkflowWithSteps => {
   return {
      ...toDWorkflowInternal(w),
      stepCount: w.steps.length,
      steps: map(w.steps, toDWorkflowStepInternal),
   };
};

describe("toDWorkflows tests", () => {
   it("toDWorkflows test", () => {
      const workflows = ptestData.pWorkflowWithStepCounts(3);
      const result = toDWorkflows(workflows);
      const expectedResult = map(workflows, toDWorkflowWithStepCountInternal);
      expect(result).toEqual(expectedResult);
   });

   it("toDWorkflowWithStepCount test", () => {
      const workflow = ptestData.pWorkflowWithStepCount(1);
      const result = toDWorkflowWithStepCount(workflow);
      const expectedResult = toDWorkflowWithStepCountInternal(workflow);
      expect(result).toEqual(expectedResult);
   });

   it("toDWorkflowWithSteps test", () => {
      const workflow = ptestData.pWorkflowWithSteps(1);
      const result = toDWorkflowWithSteps(workflow);
      const expectedResult = toDWorkflowWithStepsInternal(workflow);
      expect(result).toEqual(expectedResult);
   });

   it("toDWorkflowStep test", () => {
      const workflow1 = ptestData.pWorkflowStepWithEdgesAndPrompt(1);
      const result1 = toDWorkflowStep(workflow1);
      const expectedResult1 = toDWorkflowStepInternal(workflow1);
      expect(result1).toEqual(expectedResult1);

      const workflow2 = ptestData.pWorkflowStepWithEdgesAndPrompt(123);
      workflow2.prompt = null;
      const result2 = toDWorkflowStep(workflow2);
      const expectedResult2 = toDWorkflowStepInternal(workflow2);
      expect(result2).toEqual(expectedResult2);
   });

   it("toDWorkflow test", () => {
      const workflow = ptestData.pWorkflow(1);
      const result = toDWorkflow(workflow);
      const expectedResult = toDWorkflowInternal(workflow);
      expect(result).toEqual(expectedResult);
   });

   it("toDWorkflowStepEdge test", () => {
      const workflow = ptestData.pWorkflowStepEdge(1);
      const result = toDWorkflowStepEdge(workflow);
      const expectedResult = toDWorkflowStepEdgeInternal(workflow);
      expect(result).toEqual(expectedResult);
   });
});

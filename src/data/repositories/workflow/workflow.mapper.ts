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

export const toDWorkflows = (ws: WorkflowWithStepCount[]): DWorkflow[] => {
   return map(ws, toDWorkflowWithStepCount);
};

export const toDWorkflowWithStepCount = (
   w: WorkflowWithStepCount
): DWorkflow => {
   return {
      ...toDWorkflow(w),
      stepCount: w._count.steps,
   };
};

export const toDWorkflowWithSteps = (
   w: WorkflowWithSteps
): DWorkflowWithSteps => {
   return {
      ...toDWorkflow(w),
      stepCount: w.steps.length,
      steps: map(w.steps, toDWorkflowStep),
   };
};

export const toDWorkflow = (w: Workflow): DWorkflow => {
   return {
      id: w.id,
      title: w.title,
      description: w.description,
      stepCount: 0,
      updatedAt: w.updatedAt.toISOString(),
      createdAt: w.createdAt.toISOString(),
   };
};

export const toDWorkflowStep = (
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
      outgoingEdges: map(s.outgoingEdges, toDWorkflowStepEdge),
   };
};

export const toDWorkflowStepEdge = (e: WorkflowStepEdge): DWorkflowStepEdge => {
   return {
      id: e.id,
      fromStepEdgeId: e.fromStepEdgeId,
      toStepEdgeId: e.fromStepEdgeId,
      label: e.label,
      order: e.order,
   };
};

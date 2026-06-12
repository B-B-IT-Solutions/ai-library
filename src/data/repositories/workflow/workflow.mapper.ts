import { map } from "es-toolkit/compat";

import {
   WorkflowStepWithEdgesAndPrompt,
   WorkflowWithStepCount,
   WorkflowWithSteps,
} from "@/data/types/db/workflow";
import {
   DWorkflow,
   DWorkflowDetail,
   DWorkflowStep,
   DWorkflowStepEdge,
} from "@/data/types/domain/workflow";
import { WorkflowStepEdge } from "@/generated/prisma/client";

export const toDWorkflow = (w: WorkflowWithStepCount): DWorkflow => ({
   id: w.id,
   title: w.title,
   description: w.description,
   stepCount: w._count.steps,
   updatedAt: w.updatedAt.toISOString(),
   createdAt: w.createdAt.toISOString(),
});

export const toDWorkflows = (ws: WorkflowWithStepCount[]): DWorkflow[] =>
   map(ws, toDWorkflow);

export const toDWorkflowStepEdge = (
   e: WorkflowStepEdge
): DWorkflowStepEdge => ({
   id: e.id,
   fromStepId: e.fromStepId,
   toStepId: e.toStepId,
   label: e.label,
   order: e.order,
});

export const toDWorkflowStep = (
   s: WorkflowStepWithEdgesAndPrompt
): DWorkflowStep => ({
   id: s.id,
   workflowId: s.workflowId,
   title: s.title,
   hint: s.hint,
   type: s.type,
   promptId: s.promptId,
   promptTitle: s.prompt?.title ?? null,
   content: s.content,
   isStart: s.isStart,
   position: s.position,
   outgoingEdges: map(s.outgoingEdges, toDWorkflowStepEdge),
});

export const toDWorkflowDetail = (w: WorkflowWithSteps): DWorkflowDetail => ({
   id: w.id,
   title: w.title,
   description: w.description,
   stepCount: w.steps.length,
   updatedAt: w.updatedAt.toISOString(),
   createdAt: w.createdAt.toISOString(),
   steps: map(w.steps, toDWorkflowStep),
});

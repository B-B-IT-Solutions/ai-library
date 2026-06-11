import { map } from "es-toolkit/compat";

import {
   WorkflowDetailRow,
   WorkflowStepWithEdgesAndTemplate,
   WorkflowWithStepCount,
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

export const toDWorkflowStepEdge = (e: WorkflowStepEdge): DWorkflowStepEdge => ({
   id: e.id,
   fromStepId: e.fromStepId,
   toStepId: e.toStepId,
   label: e.label,
   order: e.order,
});

export const toDWorkflowStep = (
   s: WorkflowStepWithEdgesAndTemplate
): DWorkflowStep => ({
   id: s.id,
   workflowId: s.workflowId,
   title: s.title,
   hint: s.hint,
   type: s.type,
   templateId: s.templateId,
   templateTitle: s.template?.title ?? null,
   content: s.content,
   isStart: s.isStart,
   position: s.position,
   outgoingEdges: map(s.outgoingEdges, toDWorkflowStepEdge),
});

export const toDWorkflowDetail = (w: WorkflowDetailRow): DWorkflowDetail => ({
   id: w.id,
   title: w.title,
   description: w.description,
   stepCount: w._count.steps,
   updatedAt: w.updatedAt.toISOString(),
   createdAt: w.createdAt.toISOString(),
   steps: map(w.steps, toDWorkflowStep),
});

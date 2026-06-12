import {
   Workflow,
   WorkflowStep,
   WorkflowStepEdge,
} from "@/generated/prisma/client";

export type WorkflowWithStepCount = Workflow & {
   _count: {
      steps: number;
   };
};

export type WorkflowStepEdgeRow = WorkflowStepEdge;

export type WorkflowStepWithEdgesAndTemplate = WorkflowStep & {
   outgoingEdges: WorkflowStepEdge[];
   template: { title: string } | null;
};

export type WorkflowDetailRow = Workflow & {
   _count: { steps: number };
   steps: WorkflowStepWithEdgesAndTemplate[];
};

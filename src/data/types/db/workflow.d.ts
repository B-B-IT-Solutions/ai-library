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

export type WorkflowStepWithEdgesAndTemplate = WorkflowStep & {
   outgoingEdges: WorkflowStepEdge[];
   prompt: { title: string } | null;
};

export type WorkflowDetailRow = Workflow & {
   _count: { steps: number };
   steps: WorkflowStepWithEdgesAndTemplate[];
};

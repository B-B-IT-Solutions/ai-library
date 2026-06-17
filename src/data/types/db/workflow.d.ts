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

export type WorkflowWithSteps = Workflow & {
   steps: WorkflowStepWithEdgesAndPrompt[];
};

export type WorkflowStepEdgeWithTarget = WorkflowStepEdge & {
   toStep: { edgeId: string };
};

export type WorkflowStepWithEdgesAndPrompt = WorkflowStep & {
   outgoingEdges: WorkflowStepEdgeWithTarget[];
   prompt: { title: string } | null;
};

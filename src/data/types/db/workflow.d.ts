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

export type WorkflowStepWithEdgesAndPrompt = WorkflowStep & {
   outgoingEdges: WorkflowStepEdge[];
   prompt: { title: string } | null;
};

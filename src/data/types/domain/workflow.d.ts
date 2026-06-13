import { Page, PageQuery } from "../common";

export type DWorkflowsPageQuery = PageQuery<DWorkflowsFilter>;
export type DWorkflowsPage = Page<DWorkflow>;

export type DWorkflowsFilter = {
   search?: string;
};

export type DWorkflowStepType = "PROMPT_REF" | "STANDALONE";

export type DWorkflow = {
   id: string;
   title: string;
   description: string | null;
   stepCount: number;
   updatedAt: string;
   createdAt: string;
};

export type DWorkflowWithSteps = DWorkflow & {
   steps: DWorkflowStep[];
};

export type DWorkflowStep = {
   id: string;
   workflowId: string;
   title: string;
   hint: string | null;
   type: DWorkflowStepType;
   promptId: string | null;
   promptTitle: string | null; // denormalisiert für UI-Anzeige
   content: string | null;
   isStart: boolean;
   position: number;
   outgoingEdges: DWorkflowStepEdge[];
};

export type DWorkflowStepEdge = {
   id: string;
   fromStepId: string;
   toStepId: string;
   label: string;
   order: number;
};

export type DWorkflowsUsage = {
   current: number;
   limit: number; // -1 = unbegrenzt (PRO)
};

export type DWorkflowUpdate = {
   title: string;
   description?: string | null;
};

export type DWorkflowStepEdgeInput = {
   toStepId: string;
   label: string;
   order: number;
};

export type DWorkflowStepUpdate = {
   title: string;
   hint?: string | null;
   type: DWorkflowStepType;
   promptId?: string | null;
   content?: string | null;
   isStart?: boolean;
   position?: number;
   edges?: DWorkflowStepEdgeInput[];
};

export type DWorkflowStepWithOutgoingEdges = {
   id: string;
   outgoingEdges: Array<{ toStepId: string }>;
};

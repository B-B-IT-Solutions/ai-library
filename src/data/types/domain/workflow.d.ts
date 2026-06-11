export type DWorkflowStepType = "TEMPLATE_REF" | "STANDALONE";

export type DWorkflow = {
   id: string;
   title: string;
   description: string | null;
   stepCount: number;
   updatedAt: string;
   createdAt: string;
};

export type DWorkflowStepEdge = {
   id: string;
   fromStepId: string;
   toStepId: string;
   label: string;
   order: number;
};

export type DWorkflowStep = {
   id: string;
   workflowId: string;
   title: string;
   hint: string | null;
   type: DWorkflowStepType;
   templateId: string | null;
   templateTitle: string | null; // denormalisiert für UI-Anzeige
   content: string | null;
   isStart: boolean;
   position: number;
   outgoingEdges: DWorkflowStepEdge[];
};

export type DWorkflowDetail = DWorkflow & {
   steps: DWorkflowStep[];
};

export type DWorkflowsUsage = {
   current: number;
   limit: number; // -1 = unbegrenzt (PRO)
};

export type DWorkflowCreate = {
   title: string;
   description?: string | null;
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

export type DWorkflowStepCreate = {
   title: string;
   hint?: string | null;
   type: DWorkflowStepType;
   templateId?: string | null;
   content?: string | null;
   isStart?: boolean;
   position?: number;
   edges?: DWorkflowStepEdgeInput[];
};

export type DWorkflowStepUpdate = {
   title: string;
   hint?: string | null;
   type: DWorkflowStepType;
   templateId?: string | null;
   content?: string | null;
   isStart?: boolean;
   position?: number;
   edges?: DWorkflowStepEdgeInput[];
};

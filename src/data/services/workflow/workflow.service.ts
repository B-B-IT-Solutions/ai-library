import { WorkflowRepository } from "@/data/repositories/workflow";
import {
   DWorkflow,
   DWorkflowCreate,
   DWorkflowDetail,
   DWorkflowStepCreate,
   DWorkflowStepUpdate,
   DWorkflowsUsage,
   DWorkflowUpdate,
} from "@/data/types/domain/workflow";
import { hasReachedLimit } from "@/lib/subscription/access-control";
import { SubscriptionAccessError } from "@/lib/subscription/server-guards";
import { SubscriptionService } from "../subscription";

export class WorkflowService {
   constructor(
      private readonly repository: WorkflowRepository,
      private readonly subscriptionService: SubscriptionService
   ) {}

   async getWorkflows(userId: string): Promise<DWorkflow[]> {
      return this.repository.pGetWorkflows(userId);
   }

   async getWorkflowById(
      userId: string,
      workflowId: string
   ): Promise<DWorkflowDetail | null> {
      return this.repository.pGetWorkflowById(userId, workflowId);
   }

   async getWorkflowsUsage(userId: string): Promise<DWorkflowsUsage> {
      const tier = await this.subscriptionService.getUserTier(userId);
      const current = await this.repository.pCountWorkflows(userId);

      const tierFeatures = {
         FREE: 0,
         BASIC: 5,
         PRO: -1,
      } as const;

      const limit = tierFeatures[tier];

      return { current, limit };
   }

   async createWorkflow(
      userId: string,
      data: DWorkflowCreate
   ): Promise<DWorkflowDetail> {
      const tier = await this.subscriptionService.getUserTier(userId);

      if (tier === "FREE") {
         throw new SubscriptionAccessError(
            "Workflows sind nur für BASIC- und PRO-Nutzer verfügbar.",
            "canUseWorkflows"
         );
      }

      if (tier === "BASIC") {
         const count = await this.repository.pCountWorkflows(userId);
         if (hasReachedLimit(tier, "maxWorkflows", count)) {
            throw new WorkflowLimitError(
               "WORKFLOW_LIMIT_REACHED",
               "Du hast das Limit von 5 Workflows erreicht. Upgrade auf PRO für unbegrenzte Workflows."
            );
         }
      }

      return this.repository.pCreateWorkflow(userId, data);
   }

   async updateWorkflow(
      userId: string,
      workflowId: string,
      data: DWorkflowUpdate
   ): Promise<DWorkflowDetail> {
      const workflow = await this.repository.pGetWorkflowById(
         userId,
         workflowId
      );
      if (!workflow) {
         throw new Error("Workflow nicht gefunden.");
      }
      return this.repository.pUpdateWorkflow(userId, workflowId, data);
   }

   async deleteWorkflow(userId: string, workflowId: string): Promise<void> {
      const workflow = await this.repository.pGetWorkflowById(
         userId,
         workflowId
      );
      if (!workflow) {
         throw new Error("Workflow nicht gefunden.");
      }
      await this.repository.pDeleteWorkflow(userId, workflowId);
   }

   async createWorkflowStep(
      userId: string,
      workflowId: string,
      data: DWorkflowStepCreate
   ): Promise<DWorkflowDetail> {
      // Verify ownership
      const workflow = await this.repository.pGetWorkflowById(
         userId,
         workflowId
      );
      if (!workflow) {
         throw new Error("Workflow nicht gefunden.");
      }

      const tier = await this.subscriptionService.getUserTier(userId);

      if (tier === "BASIC") {
         const stepCount =
            await this.repository.pCountWorkflowSteps(workflowId);
         if (hasReachedLimit(tier, "maxWorkflowSteps", stepCount)) {
            throw new WorkflowLimitError(
               "STEP_LIMIT_REACHED",
               "Maximale Schrittanzahl erreicht (10/10). Upgrade auf PRO."
            );
         }
      }

      return this.repository.pCreateWorkflowStep(userId, workflowId, data);
   }

   async updateWorkflowStep(
      userId: string,
      stepId: string,
      workflowId: string,
      data: DWorkflowStepUpdate
   ): Promise<DWorkflowDetail> {
      // Verify ownership
      const workflow = await this.repository.pGetWorkflowById(
         userId,
         workflowId
      );
      if (!workflow) {
         throw new Error("Workflow nicht gefunden.");
      }

      // Cycle detection
      if (data.edges && data.edges.length > 0) {
         const allSteps =
            await this.repository.pGetStepsForCycleCheck(workflowId);
         detectCycle(
            allSteps,
            stepId,
            data.edges.map((e) => e.toStepId)
         );
      }

      return this.repository.pUpdateWorkflowStep(userId, stepId, data);
   }

   async deleteWorkflowStep(
      userId: string,
      stepId: string,
      workflowId: string
   ): Promise<DWorkflowDetail> {
      // Verify ownership
      const workflow = await this.repository.pGetWorkflowById(
         userId,
         workflowId
      );
      if (!workflow) {
         throw new Error("Workflow nicht gefunden.");
      }
      return this.repository.pDeleteWorkflowStep(userId, stepId);
   }

   async setStartStep(
      userId: string,
      workflowId: string,
      stepId: string
   ): Promise<void> {
      const workflow = await this.repository.pGetWorkflowById(
         userId,
         workflowId
      );
      if (!workflow) {
         throw new Error("Workflow nicht gefunden.");
      }
      await this.repository.pSetStartStep(userId, workflowId, stepId);
   }
}

// ── Error classes ────────────────────────────────────────────────────────────

export class WorkflowLimitError extends Error {
   constructor(
      public readonly code: "WORKFLOW_LIMIT_REACHED" | "STEP_LIMIT_REACHED",
      message: string
   ) {
      super(message);
      this.name = "WorkflowLimitError";
      Object.setPrototypeOf(this, WorkflowLimitError.prototype);
   }
}

// ── Cycle detection (DFS) ────────────────────────────────────────────────────

/**
 * Detects whether adding edges from `fromStepId` → `newToStepIds`
 * would create a cycle in the workflow's step graph.
 */
export function detectCycle(
   steps: Array<{ id: string; outgoingEdges: Array<{ toStepId: string }> }>,
   fromStepId: string,
   newToStepIds: string[]
): void {
   // Build adjacency map with the proposed new edges merged in
   const adj = new Map<string, string[]>();
   for (const s of steps) {
      adj.set(
         s.id,
         s.id === fromStepId
            ? newToStepIds
            : s.outgoingEdges.map((e) => e.toStepId)
      );
   }

   // DFS from every node (handles disconnected graph)
   const visited = new Set<string>();
   const inStack = new Set<string>();

   const dfs = (nodeId: string): boolean => {
      if (inStack.has(nodeId)) return true; // cycle!
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      inStack.add(nodeId);

      for (const neighbour of adj.get(nodeId) ?? []) {
         if (dfs(neighbour)) return true;
      }

      inStack.delete(nodeId);
      return false;
   };

   for (const s of steps) {
      if (!visited.has(s.id)) {
         if (dfs(s.id)) {
            throw new Error("Diese Verbindung erzeugt eine Endlosschleife");
         }
      }
   }
}

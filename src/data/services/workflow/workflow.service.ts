import { WorkflowRepository } from "@/data/repositories/workflow";
import {
   DWorkflow,
   DWorkflowStepCreate,
   DWorkflowStepUpdate,
   DWorkflowsUsage,
   DWorkflowUpdate,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";
import {
   FeatureName,
   hasReachedLimit,
} from "@/lib/subscription/access-control";
import { SubscriptionService } from "../subscription";

export class WorkflowService {
   constructor(
      private readonly repository: WorkflowRepository,
      private readonly subscriptionService: SubscriptionService
   ) {}

   async getWorkflows(userId: string): Promise<DWorkflow[]> {
      return this.repository.pGetWorkflows(userId);
   }

   async getWorkflowWithSteps(
      userId: string,
      workflowId: string
   ): Promise<DWorkflowWithSteps | null> {
      return this.repository.pGetWorkflowWithSteps(userId, workflowId);
   }

   async createWorkflow(
      userId: string,
      data: DWorkflowUpdate
   ): Promise<DWorkflow> {
      const currentCount = await this.getWorkflowsCount(userId);
      const feature: FeatureName = "maxWorkflows";
      await this.subscriptionService.requireCountLimit(
         userId,
         feature,
         currentCount
      );

      return this.repository.pCreateWorkflow(userId, data);
   }

   async updateWorkflow(
      userId: string,
      workflowId: string,
      data: DWorkflowUpdate
   ): Promise<DWorkflow> {
      const workflow = await this.repository.pGetWorkflow(userId, workflowId);
      if (!workflow) {
         throw new Error("Workflow not found.");
      }
      return this.repository.pUpdateWorkflow(userId, workflowId, data);
   }

   async deleteWorkflow(userId: string, workflowId: string): Promise<void> {
      const workflow = await this.repository.pGetWorkflow(userId, workflowId);
      if (!workflow) {
         throw new Error("Workflow not found.");
      }
      await this.repository.pDeleteWorkflow(userId, workflowId);
   }

   async createWorkflowStep(
      userId: string,
      workflowId: string,
      data: DWorkflowStepCreate
   ): Promise<DWorkflowWithSteps> {
      // Verify ownership
      const workflow = await this.repository.pGetWorkflowWithSteps(
         userId,
         workflowId
      );
      if (!workflow) {
         throw new Error("Workflow not found.");
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
   ): Promise<DWorkflowWithSteps> {
      // Verify ownership
      const workflow = await this.repository.pGetWorkflowWithSteps(
         userId,
         workflowId
      );
      if (!workflow) {
         throw new Error("Workflow not found.");
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
   ): Promise<DWorkflowWithSteps> {
      // Verify ownership
      const workflow = await this.repository.pGetWorkflowWithSteps(
         userId,
         workflowId
      );
      if (!workflow) {
         throw new Error("Workflow not found.");
      }
      return this.repository.pDeleteWorkflowStep(userId, stepId);
   }

   async setStartStep(
      userId: string,
      workflowId: string,
      stepId: string
   ): Promise<void> {
      const workflow = await this.repository.pGetWorkflowWithSteps(
         userId,
         workflowId
      );
      if (!workflow) {
         throw new Error("Workflow not found.");
      }
      await this.repository.pSetStartStep(userId, workflowId, stepId);
   }

   async getWorkflowsCount(userId: string): Promise<number> {
      return await this.repository.pGetWorkflowsCount(userId);
   }

   async getWorkflowsUsage(userId: string): Promise<DWorkflowsUsage> {
      const tier = await this.subscriptionService.getUserTier(userId);
      const current = await this.repository.pGetWorkflowsCount(userId);

      const tierFeatures = {
         FREE: 0,
         BASIC: 5,
         PRO: -1,
      } as const;

      const limit = tierFeatures[tier];

      return { current, limit };
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

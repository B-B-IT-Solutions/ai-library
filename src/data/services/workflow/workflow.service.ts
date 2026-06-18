import { WorkflowRepository } from "@/data/repositories/workflow";
import {
   DWorkflow,
   DWorkflowsPage,
   DWorkflowsPageQuery,
   DWorkflowStepUpdate,
   DWorkflowsUsage,
   DWorkflowUpdate,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";
import { FeatureName } from "@/lib/subscription/access-control";
import { SubscriptionService } from "../subscription";

import { detectCycle } from "./utils";

export class WorkflowService {
   constructor(
      private readonly repository: WorkflowRepository,
      private readonly subscriptionService: SubscriptionService
   ) {}

   async getWorkflowsPage(
      userId: string,
      query?: DWorkflowsPageQuery
   ): Promise<DWorkflowsPage> {
      return this.repository.pGetWorkflowsPage(userId, query);
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
      data: DWorkflowStepUpdate
   ): Promise<DWorkflowWithSteps> {
      // Verify ownership
      const workflow = await this.repository.pGetWorkflow(userId, workflowId);
      if (!workflow) {
         throw new Error("Workflow not found.");
      }

      const stepCount = await this.repository.pCountWorkflowSteps(workflowId);
      const feature: FeatureName = "maxWorkflowSteps";
      await this.subscriptionService.requireCountLimit(
         userId,
         feature,
         stepCount
      );

      return this.repository.pCreateWorkflowStep(userId, workflowId, data);
   }

   async updateWorkflowStep(
      userId: string,
      stepId: string,
      workflowId: string,
      data: DWorkflowStepUpdate
   ): Promise<DWorkflowWithSteps> {
      // Verify ownership
      const workflow = await this.repository.pGetWorkflow(userId, workflowId);
      if (!workflow) {
         throw new Error("Workflow not found.");
      }

      // Cycle detection
      if (data.edges && data.edges.length > 0) {
         const allSteps =
            await this.repository.pGetWorkflowStepsForCycleCheck(workflowId);
         const fromStep = allSteps.find((s) => s.id === stepId);
         if (fromStep) {
            detectCycle(
               allSteps,
               fromStep.edgeId,
               data.edges.map((e) => e.toStepId)
            );
         }
      }

      return this.repository.pUpdateWorkflowStep(userId, stepId, data);
   }

   async deleteWorkflowStep(
      userId: string,
      stepId: string,
      workflowId: string
   ): Promise<DWorkflowWithSteps> {
      // Verify ownership
      const workflow = await this.repository.pGetWorkflow(userId, workflowId);
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
      const workflow = await this.repository.pGetWorkflow(userId, workflowId);
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

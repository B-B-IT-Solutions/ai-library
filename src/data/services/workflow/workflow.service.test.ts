jest.mock("@/data/repositories/workflow");
jest.mock("@/data/services/subscription");

import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { WorkflowRepository } from "@/data/repositories/workflow";
import { SubscriptionService } from "@/data/services/subscription";
import { ServiceFactory } from "../service.factory";

import {
   detectCycle,
   WorkflowLimitError,
   WorkflowService,
} from "./workflow.service";

const serviceFactory = new ServiceFactory(prisma);
const subscriptionService = serviceFactory.getSubscriptionService();

const subscriptionServiceMock =
   subscriptionService as DeepMockProxy<SubscriptionService>;

const workflowRepo = new WorkflowRepository(prisma);
const workflowRepoMock = workflowRepo as DeepMockProxy<WorkflowRepository>;

const workflowService = new WorkflowService(
   workflowRepoMock,
   subscriptionServiceMock
);

const userId = "334db648-f300-4284-8149-075ff465d750";
const workflowId = "444db648-f300-4284-8149-075ff465d750";

const baseWorkflow = {
   id: workflowId,
   title: "Test Workflow",
   description: null,
   stepCount: 0,
   updatedAt: new Date().toISOString(),
   createdAt: new Date().toISOString(),
   steps: [],
};

// ── detectCycle ───────────────────────────────────────────────────────────────

describe("detectCycle", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("should not throw for a simple linear graph (A → B → C)", () => {
      const steps = [
         { id: "A", outgoingEdges: [{ toStepId: "B" }] },
         { id: "B", outgoingEdges: [{ toStepId: "C" }] },
         { id: "C", outgoingEdges: [] },
      ];
      expect(() => detectCycle(steps, "A", ["B"])).not.toThrow();
   });

   it("should throw when adding C → A creates a cycle (A → B → C → A)", () => {
      const steps = [
         { id: "A", outgoingEdges: [{ toStepId: "B" }] },
         { id: "B", outgoingEdges: [{ toStepId: "C" }] },
         { id: "C", outgoingEdges: [] },
      ];
      expect(() => detectCycle(steps, "C", ["A"])).toThrow(
         "Diese Verbindung erzeugt eine Endlosschleife"
      );
   });

   it("should throw for a self-loop (A → A)", () => {
      const steps = [
         { id: "A", outgoingEdges: [] },
         { id: "B", outgoingEdges: [] },
      ];
      expect(() => detectCycle(steps, "A", ["A"])).toThrow(
         "Diese Verbindung erzeugt eine Endlosschleife"
      );
   });

   it("should not throw for a branching DAG (A → B, A → C)", () => {
      const steps = [
         { id: "A", outgoingEdges: [] },
         { id: "B", outgoingEdges: [] },
         { id: "C", outgoingEdges: [] },
      ];
      expect(() => detectCycle(steps, "A", ["B", "C"])).not.toThrow();
   });

   it("should not throw when graph has multiple start points (disconnected)", () => {
      const steps = [
         { id: "A", outgoingEdges: [{ toStepId: "B" }] },
         { id: "B", outgoingEdges: [] },
         { id: "C", outgoingEdges: [{ toStepId: "D" }] },
         { id: "D", outgoingEdges: [] },
      ];
      expect(() => detectCycle(steps, "A", ["B"])).not.toThrow();
   });

   it("should throw for indirect cycle (A → B → C → B)", () => {
      const steps = [
         { id: "A", outgoingEdges: [{ toStepId: "B" }] },
         { id: "B", outgoingEdges: [{ toStepId: "C" }] },
         { id: "C", outgoingEdges: [] },
      ];
      // Adding B → C creates: A→B→C and C will get B from proposed edges
      expect(() => detectCycle(steps, "C", ["B"])).toThrow(
         "Diese Verbindung erzeugt eine Endlosschleife"
      );
   });
});

// ── createWorkflow ────────────────────────────────────────────────────────────

describe("createWorkflow", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("should throw SubscriptionAccessError for FREE users", async () => {
      subscriptionServiceMock.getUserTier.mockResolvedValue("FREE");

      await expect(
         workflowService.createWorkflow(userId, { title: "My Workflow" })
      ).rejects.toThrow(
         "Workflows sind nur für BASIC- und PRO-Nutzer verfügbar."
      );
   });

   it("should throw WorkflowLimitError when BASIC user has reached 5 workflows", async () => {
      subscriptionServiceMock.getUserTier.mockResolvedValue("BASIC");
      workflowRepoMock.pCountWorkflows.mockResolvedValue(5);

      await expect(
         workflowService.createWorkflow(userId, { title: "My Workflow" })
      ).rejects.toBeInstanceOf(WorkflowLimitError);
   });

   it("should create workflow for PRO user without limits", async () => {
      subscriptionServiceMock.getUserTier.mockResolvedValue("PRO");
      workflowRepoMock.pCreateWorkflow.mockResolvedValue(baseWorkflow);

      const result = await workflowService.createWorkflow(userId, {
         title: "My Workflow",
      });

      expect(result).toEqual(baseWorkflow);
      expect(workflowRepoMock.pCreateWorkflow).toHaveBeenCalledTimes(1);
   });

   it("should create workflow for BASIC user when under limit (< 5)", async () => {
      subscriptionServiceMock.getUserTier.mockResolvedValue("BASIC");
      workflowRepoMock.pCountWorkflows.mockResolvedValue(3);
      workflowRepoMock.pCreateWorkflow.mockResolvedValue(baseWorkflow);

      const result = await workflowService.createWorkflow(userId, {
         title: "My Workflow",
      });

      expect(result).toEqual(baseWorkflow);
   });
});

// ── createWorkflowStep ────────────────────────────────────────────────────────

describe("createWorkflowStep", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("should throw when workflow not found", async () => {
      workflowRepoMock.pGetWorkflowById.mockResolvedValue(null);

      await expect(
         workflowService.createWorkflowStep(userId, workflowId, {
            title: "Step",
            type: "STANDALONE",
            content: "content",
            isStart: true,
            position: 0,
            edges: [],
         })
      ).rejects.toThrow("Workflow nicht gefunden.");
   });

   it("should throw WorkflowLimitError when BASIC user has 10 steps", async () => {
      workflowRepoMock.pGetWorkflowById.mockResolvedValue(baseWorkflow);
      subscriptionServiceMock.getUserTier.mockResolvedValue("BASIC");
      workflowRepoMock.pCountWorkflowSteps.mockResolvedValue(10);

      await expect(
         workflowService.createWorkflowStep(userId, workflowId, {
            title: "Step",
            type: "STANDALONE",
            content: "content",
            isStart: false,
            position: 10,
            edges: [],
         })
      ).rejects.toBeInstanceOf(WorkflowLimitError);
   });

   it("should allow PRO user to exceed 10 steps", async () => {
      workflowRepoMock.pGetWorkflowById.mockResolvedValue(baseWorkflow);
      subscriptionServiceMock.getUserTier.mockResolvedValue("PRO");
      workflowRepoMock.pCreateWorkflowStep.mockResolvedValue(baseWorkflow);

      const result = await workflowService.createWorkflowStep(
         userId,
         workflowId,
         {
            title: "Step 11",
            type: "STANDALONE",
            content: "content",
            isStart: false,
            position: 10,
            edges: [],
         }
      );

      expect(result).toEqual(baseWorkflow);
      expect(workflowRepoMock.pCreateWorkflowStep).toHaveBeenCalledTimes(1);
   });
});

// ── deleteWorkflow ────────────────────────────────────────────────────────────

describe("deleteWorkflow", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("should throw when workflow not found", async () => {
      workflowRepoMock.pGetWorkflowById.mockResolvedValue(null);

      await expect(
         workflowService.deleteWorkflow(userId, workflowId)
      ).rejects.toThrow("Workflow nicht gefunden.");
   });

   it("should delete workflow successfully", async () => {
      workflowRepoMock.pGetWorkflowById.mockResolvedValue(baseWorkflow);
      workflowRepoMock.pDeleteWorkflow.mockResolvedValue(undefined);

      await workflowService.deleteWorkflow(userId, workflowId);

      expect(workflowRepoMock.pDeleteWorkflow).toHaveBeenCalledWith(
         userId,
         workflowId
      );
   });
});

// ── updateWorkflowStep (cycle detection) ─────────────────────────────────────

describe("updateWorkflowStep with cycle detection", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   const stepId = "step-a";

   it("should detect cycle and throw", async () => {
      workflowRepoMock.pGetWorkflowById.mockResolvedValue({
         ...baseWorkflow,
         steps: [
            {
               id: "step-a",
               workflowId,
               title: "A",
               hint: null,
               type: "STANDALONE",
               promptId: null,
               promptTitle: null,
               content: "a",
               isStart: true,
               position: 0,
               outgoingEdges: [
                  {
                     id: "e1",
                     fromStepId: "step-a",
                     toStepId: "step-b",
                     label: "Next",
                     order: 0,
                  },
               ],
            },
            {
               id: "step-b",
               workflowId,
               title: "B",
               hint: null,
               type: "STANDALONE",
               promptId: null,
               promptTitle: null,
               content: "b",
               isStart: false,
               position: 1,
               outgoingEdges: [],
            },
         ],
      });

      workflowRepoMock.pGetStepsForCycleCheck.mockResolvedValue([
         { id: "step-a", outgoingEdges: [{ toStepId: "step-b" }] },
         { id: "step-b", outgoingEdges: [] },
      ]);

      await expect(
         workflowService.updateWorkflowStep(userId, "step-b", workflowId, {
            title: "B",
            type: "STANDALONE",
            content: "b",
            isStart: false,
            position: 1,
            edges: [{ toStepId: "step-a", label: "Back", order: 0 }],
         })
      ).rejects.toThrow("Endlosschleife");
   });
});

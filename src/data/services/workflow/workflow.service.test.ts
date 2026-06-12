jest.mock("@/data/repositories/workflow");
jest.mock("@/data/services/subscription");

import { dtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { WorkflowRepository } from "@/data/repositories/workflow";
import { SubscriptionService } from "@/data/services/subscription";
import { FeatureName } from "@/lib/subscription/access-control";
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

describe("getWorkflows tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("workflows retrieved - test", async () => {
      const userId = "user-id-1";
      const workflows = dtestData.dWorkflows();
      workflowRepoMock.pGetWorkflows.mockResolvedValue(workflows);

      const result = await workflowService.getWorkflows(userId);

      expect(result).toEqual(workflows);
      expect(workflowRepoMock.pGetWorkflows).toHaveBeenCalledTimes(1);
      expect(workflowRepoMock.pGetWorkflows).toHaveBeenCalledWith(userId);
   });
});

describe("getWorkflowWithSteps tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("workflow retrieved - test", async () => {
      const userId = "user-id-1";
      const workflow = dtestData.dWorkflowWithSteps();
      workflowRepoMock.pGetWorkflowWithSteps.mockResolvedValue(workflow);

      const result = await workflowService.getWorkflowWithSteps(
         userId,
         workflow.id
      );

      expect(result).toEqual(workflow);
      expect(workflowRepoMock.pGetWorkflowWithSteps).toHaveBeenCalledTimes(1);
      expect(workflowRepoMock.pGetWorkflowWithSteps).toHaveBeenCalledWith(
         userId,
         workflow.id
      );
   });
});

describe("createWorkflow", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("workflow created - test", async () => {
      const userId = "user-id-1";
      const feature: FeatureName = "maxWorkflows";

      const workflowsCount = 71;
      workflowRepoMock.pGetWorkflowsCount.mockResolvedValue(workflowsCount);

      const newWorkflow = dtestData.dWorkflow();
      workflowRepoMock.pCreateWorkflow.mockResolvedValue(newWorkflow);

      const update = dtestData.dWorkflowUpdate();

      const result = await workflowService.createWorkflow(userId, update);

      expect(result).toEqual(newWorkflow);
      expect(workflowRepoMock.pCreateWorkflow).toHaveBeenCalledTimes(1);
      expect(workflowRepoMock.pCreateWorkflow).toHaveBeenCalledWith(
         userId,
         update
      );
      expect(workflowRepoMock.pGetWorkflowsCount).toHaveBeenCalledTimes(1);
      expect(workflowRepoMock.pGetWorkflowsCount).toHaveBeenCalledWith(userId);
      expect(subscriptionServiceMock.requireCountLimit).toHaveBeenCalledTimes(
         1
      );
      expect(subscriptionServiceMock.requireCountLimit).toHaveBeenCalledWith(
         userId,
         feature,
         workflowsCount
      );
   });
});

describe("updateWorkflow", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("workflow null - test", async () => {
      const workflowId = "workflow-id-1";
      workflowRepoMock.pGetWorkflow.mockResolvedValue(null);

      const update = dtestData.dWorkflowUpdate();
      const fn = () =>
         workflowService.updateWorkflow(userId, workflowId, update);

      await expect(fn).rejects.toThrow("Workflow not found.");
      expect(workflowRepoMock.pGetWorkflow).toHaveBeenCalledTimes(1);
      expect(workflowRepoMock.pGetWorkflow).toHaveBeenCalledWith(
         userId,
         workflowId
      );
      expect(workflowRepoMock.pUpdateWorkflow).not.toHaveBeenCalled();
   });

   it("workflow updated - test", async () => {
      const workflow = dtestData.dWorkflow();
      workflowRepoMock.pGetWorkflow.mockResolvedValue(workflow);

      workflowRepoMock.pUpdateWorkflow.mockResolvedValue(workflow);

      const update = dtestData.dWorkflowUpdate();
      const result = await workflowService.updateWorkflow(
         userId,
         workflow.id,
         update
      );

      expect(result).toEqual(workflow);
      expect(workflowRepoMock.pGetWorkflow).toHaveBeenCalledTimes(1);
      expect(workflowRepoMock.pGetWorkflow).toHaveBeenCalledWith(
         userId,
         workflow.id
      );
      expect(workflowRepoMock.pUpdateWorkflow).toHaveBeenCalledTimes(1);
      expect(workflowRepoMock.pUpdateWorkflow).toHaveBeenCalledWith(
         userId,
         workflow.id,
         update
      );
   });
});

describe("deleteWorkflow", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("workflow null - test", async () => {
      const workflowId = "workflow-id-1";
      workflowRepoMock.pGetWorkflow.mockResolvedValue(null);

      const fn = () => workflowService.deleteWorkflow(userId, workflowId);

      await expect(fn).rejects.toThrow("Workflow not found.");
      expect(workflowRepoMock.pGetWorkflow).toHaveBeenCalledTimes(1);
      expect(workflowRepoMock.pGetWorkflow).toHaveBeenCalledWith(
         userId,
         workflowId
      );
      expect(workflowRepoMock.pDeleteWorkflow).not.toHaveBeenCalled();
   });

   it("workflow deleted - test", async () => {
      const workflow = dtestData.dWorkflow();
      workflowRepoMock.pGetWorkflow.mockResolvedValue(workflow);

      workflowRepoMock.pUpdateWorkflow.mockResolvedValue(workflow);

      await workflowService.deleteWorkflow(userId, workflow.id);

      expect(workflowRepoMock.pGetWorkflow).toHaveBeenCalledTimes(1);
      expect(workflowRepoMock.pGetWorkflow).toHaveBeenCalledWith(
         userId,
         workflow.id
      );
      expect(workflowRepoMock.pDeleteWorkflow).toHaveBeenCalledTimes(1);
      expect(workflowRepoMock.pDeleteWorkflow).toHaveBeenCalledWith(
         userId,
         workflow.id
      );
   });
});

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

describe("createWorkflowStep", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("should throw when workflow not found", async () => {
      workflowRepoMock.pGetWorkflowWithSteps.mockResolvedValue(null);

      await expect(
         workflowService.createWorkflowStep(userId, workflowId, {
            title: "Step",
            type: "STANDALONE",
            content: "content",
            isStart: true,
            position: 0,
            edges: [],
         })
      ).rejects.toThrow("Workflow not found.");
   });

   it("should throw WorkflowLimitError when BASIC user has 10 steps", async () => {
      workflowRepoMock.pGetWorkflowWithSteps.mockResolvedValue(baseWorkflow);
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
      workflowRepoMock.pGetWorkflowWithSteps.mockResolvedValue(baseWorkflow);
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

describe("updateWorkflowStep with cycle detection", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   const stepId = "step-a";

   it("should detect cycle and throw", async () => {
      workflowRepoMock.pGetWorkflowWithSteps.mockResolvedValue({
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

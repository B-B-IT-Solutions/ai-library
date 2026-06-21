jest.mock("@/data/repositories/workflow");
jest.mock("@/data/services/subscription");

import { dtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { WorkflowRepository } from "@/data/repositories/workflow";
import { SubscriptionService } from "@/data/services/subscription";
import { FeatureName } from "@/lib/subscription/access-control";
import { ServiceFactory } from "../service.factory";

import { WorkflowService } from "./workflow.service";

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

describe("getWorkflowsPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("workflows retrieved - test", async () => {
      const userId = "user-id-1";
      const page = dtestData.dWorkflowsPage(1);
      workflowRepoMock.pGetWorkflowsPage.mockResolvedValue(page);

      const query = dtestData.dWorkflowsPageQuery();

      const result = await workflowService.getWorkflowsPage(userId, query);

      expect(result).toEqual(page);
      expect(workflowRepoMock.pGetWorkflowsPage).toHaveBeenCalledTimes(1);
      expect(workflowRepoMock.pGetWorkflowsPage).toHaveBeenCalledWith(
         userId,
         query
      );
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
      const userId = "user-id-1";
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
      const userId = "user-id-1";
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
      const userId = "user-id-1";
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
      const userId = "user-id-1";
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

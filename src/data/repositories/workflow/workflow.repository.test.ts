import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { DWorkflowsPageQuery, DWorkflowUpdate } from "@/data/types/domain/workflow";
import {
   WorkflowCountArgs,
   WorkflowCreateArgs,
   WorkflowDeleteArgs,
   WorkflowFindManyArgs,
   WorkflowFindUniqueArgs,
   WorkflowStepFindManyArgs,
   WorkflowUpdateArgs,
} from "@/generated/prisma/models";

import {
   toDWorkflow,
   toDWorkflows,
   toDWorkflowWithSteps,
} from "./workflow.mapper";
import { WorkflowRepository } from "./workflow.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const repository = new WorkflowRepository(prismaMock);

describe("pGetWorkflows", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("workflows retrieved - test", async () => {
      const userId = "user-id-1";

      const workflows = ptestData.pWorkflowWithStepCounts(3);
      prismaMock.workflow.findMany.mockResolvedValue(workflows);

      const result = await repository.pGetWorkflows(userId);

      const expectedResult = toDWorkflows(workflows);

      const expectedArgs: WorkflowFindManyArgs = {
         where: { userId },
         include: { _count: { select: { steps: true } } },
         orderBy: { createdAt: "desc" },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.workflow.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflow.findMany).toHaveBeenCalledWith(expectedArgs);
   });
});

describe("pGetWorkflowsCount", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("workflows count retrieved - test", async () => {
      const userId = "user-id-1";

      const workflowsCount = 11;
      prismaMock.workflow.count.mockResolvedValue(workflowsCount);

      const result = await repository.pGetWorkflowsCount(userId);

      const expectedArgs: WorkflowCountArgs = {
         where: { userId },
      };

      expect(result).toEqual(workflowsCount);
      expect(prismaMock.workflow.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflow.count).toHaveBeenCalledWith(expectedArgs);
   });
});

describe("pGetWorkflow", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("workflow null - test", async () => {
      const userId = "user-id-1";
      const workflowId = "workflow-id-0001";

      prismaMock.workflow.findUnique.mockResolvedValue(null);

      const result = await repository.pGetWorkflow(userId, workflowId);

      const expectedArgs: WorkflowFindUniqueArgs = {
         where: { id: workflowId, userId },
      };

      expect(result).toBeNull();
      expect(prismaMock.workflow.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflow.findUnique).toHaveBeenCalledWith(expectedArgs);
   });

   it("workflow retrieved - test", async () => {
      const userId = "user-id-1";

      const workflow = ptestData.pWorkflow(1);
      prismaMock.workflow.findUnique.mockResolvedValue(workflow);

      const result = await repository.pGetWorkflow(userId, workflow.id);

      const expectedResult = toDWorkflow(workflow);

      const expectedArgs: WorkflowFindUniqueArgs = {
         where: { id: workflow.id, userId },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.workflow.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflow.findUnique).toHaveBeenCalledWith(expectedArgs);
   });
});

describe("pGetWorkflowWithSteps", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("workflow null - test", async () => {
      const userId = "user-id-1";
      const workflowId = "workflow-id-0001";

      prismaMock.workflow.findUnique.mockResolvedValue(null);

      const result = await repository.pGetWorkflowWithSteps(userId, workflowId);

      const expectedArgs: WorkflowFindUniqueArgs = {
         where: { id: workflowId, userId },
         include: {
            steps: {
               orderBy: { position: "asc" },
               include: {
                  prompt: { select: { title: true } },
                  outgoingEdges: { orderBy: { order: "asc" } },
               },
            },
         },
      };

      expect(result).toBeNull();
      expect(prismaMock.workflow.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflow.findUnique).toHaveBeenCalledWith(expectedArgs);
   });

   it("workflow retrieved - test", async () => {
      const userId = "user-id-1";
      const workflowId = "workflow-id-0001";
      const row = ptestData.pWorkflowWithSteps(1);
      prismaMock.workflow.findUnique.mockResolvedValue(row);

      const result = await repository.pGetWorkflowWithSteps(userId, workflowId);

      const expectedResult = toDWorkflowWithSteps(row);

      const expectedArgs: WorkflowFindUniqueArgs = {
         where: { id: workflowId, userId },
         include: {
            steps: {
               orderBy: { position: "asc" },
               include: {
                  prompt: { select: { title: true } },
                  outgoingEdges: { orderBy: { order: "asc" } },
               },
            },
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.workflow.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflow.findUnique).toHaveBeenCalledWith(expectedArgs);
   });
});

describe("pCreateWorkflow", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("workflow created - test", async () => {
      const userId = "user-id-1";
      const workflow = ptestData.pWorkflow(1);
      prismaMock.workflow.create.mockResolvedValue(workflow);

      const createData: DWorkflowUpdate = {
         title: workflow.title,
         description: workflow.description,
      };

      const result = await repository.pCreateWorkflow(userId, createData);

      const expectedResult = toDWorkflow(workflow);

      const expectedArgs: WorkflowCreateArgs = {
         data: {
            title: workflow.title,
            description: workflow.description,
            user: {
               connect: { id: userId },
            },
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.workflow.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflow.create).toHaveBeenCalledWith(expectedArgs);
   });
});

describe("pUpdateWorkflow", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("workflow updated - test", async () => {
      const userId = "user-id-1";
      const workflow = ptestData.pWorkflow(1);
      prismaMock.workflow.update.mockResolvedValue(workflow);

      const updateData: DWorkflowUpdate = {
         title: workflow.title,
         description: workflow.description,
      };

      const result = await repository.pUpdateWorkflow(
         userId,
         workflow.id,
         updateData
      );

      const expectedResult = toDWorkflow(workflow);

      const expectedArgs: WorkflowUpdateArgs = {
         where: {
            id: workflow.id,
            userId,
         },
         data: {
            title: workflow.title,
            description: workflow.description,
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.workflow.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflow.update).toHaveBeenCalledWith(expectedArgs);
   });
});

describe("pDeleteWorkflow", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("workflow deleted - test", async () => {
      const userId = "user-id-1";
      const workflow = ptestData.pWorkflow(1);
      prismaMock.workflow.delete.mockResolvedValue(workflow);

      await repository.pDeleteWorkflow(userId, workflow.id);

      const expectedArgs: WorkflowDeleteArgs = {
         where: {
            id: workflow.id,
            userId,
         },
      };

      expect(prismaMock.workflow.delete).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflow.delete).toHaveBeenCalledWith(expectedArgs);
   });
});

describe("pGetWorkflowsPage", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("page retrieved - default query - test", async () => {
      const userId = "user-id-1";
      const rows = ptestData.pWorkflowWithStepCounts(3);
      prismaMock.workflow.findMany.mockResolvedValue(rows);
      prismaMock.workflow.count.mockResolvedValue(3);

      const result = await repository.pGetWorkflowsPage(userId);

      const expectedArgs: WorkflowFindManyArgs = {
         where: { userId },
         include: { _count: { select: { steps: true } } },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      expect(result).toEqual({
         content: toDWorkflows(rows),
         pageNumber: 0,
         pageSize: 20,
         numberOfElements: 3,
         totalPages: 1,
         totalElements: 3,
      });
      expect(prismaMock.workflow.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflow.findMany).toHaveBeenCalledWith(expectedArgs);
      expect(prismaMock.workflow.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflow.count).toHaveBeenCalledWith({ where: { userId } });
   });

   it("page retrieved - with search filter - test", async () => {
      const userId = "user-id-1";
      const rows = ptestData.pWorkflowWithStepCounts(1);
      prismaMock.workflow.findMany.mockResolvedValue(rows);
      prismaMock.workflow.count.mockResolvedValue(1);

      const query: DWorkflowsPageQuery = {
         pagination: { pageNumber: 0, pageSize: 10 },
         filter: { search: "my-flow" },
      };

      const result = await repository.pGetWorkflowsPage(userId, query);

      const where = { userId, title: { contains: "my-flow", mode: "insensitive" as const } };

      const expectedArgs: WorkflowFindManyArgs = {
         where,
         include: { _count: { select: { steps: true } } },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 10,
      };

      expect(result.content).toEqual(toDWorkflows(rows));
      expect(prismaMock.workflow.findMany).toHaveBeenCalledWith(expectedArgs);
      expect(prismaMock.workflow.count).toHaveBeenCalledWith({ where });
   });

   it("page retrieved - with pagination and sort - test", async () => {
      const userId = "user-id-1";
      const rows = ptestData.pWorkflowWithStepCounts(2);
      prismaMock.workflow.findMany.mockResolvedValue(rows);
      prismaMock.workflow.count.mockResolvedValue(22);

      const query: DWorkflowsPageQuery = {
         pagination: { pageNumber: 2, pageSize: 5 },
         sort: { field: "title", order: "asc" },
      };

      const result = await repository.pGetWorkflowsPage(userId, query);

      const expectedArgs: WorkflowFindManyArgs = {
         where: { userId },
         include: { _count: { select: { steps: true } } },
         orderBy: { title: "asc" },
         skip: 10,
         take: 5,
      };

      expect(result).toEqual({
         content: toDWorkflows(rows),
         pageNumber: 2,
         pageSize: 5,
         numberOfElements: 2,
         totalPages: 5,
         totalElements: 22,
      });
      expect(prismaMock.workflow.findMany).toHaveBeenCalledWith(expectedArgs);
   });

   it("empty page - test", async () => {
      const userId = "user-id-1";
      prismaMock.workflow.findMany.mockResolvedValue([]);
      prismaMock.workflow.count.mockResolvedValue(0);

      const result = await repository.pGetWorkflowsPage(userId);

      expect(result).toEqual({
         content: [],
         pageNumber: 0,
         pageSize: 20,
         numberOfElements: 0,
         totalPages: 0,
         totalElements: 0,
      });
   });
});

describe("pGetWorkflowStepsForCycleCheck", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("workflow steps retrieved - test", async () => {
      const workflowId = "workflow-id-1";
      const steps = dtestData.dWorkflowStepsWithOutgoingEdges();
      prismaMock.workflowStep.findMany.mockResolvedValue(steps);

      const result =
         await repository.pGetWorkflowStepsForCycleCheck(workflowId);

      const expectedArgs: WorkflowStepFindManyArgs = {
         where: { workflowId },
         select: {
            id: true,
            outgoingEdges: {
               select: { toStepId: true },
            },
         },
      };

      expect(result).toEqual(steps);
      expect(prismaMock.workflowStep.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflowStep.findMany).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

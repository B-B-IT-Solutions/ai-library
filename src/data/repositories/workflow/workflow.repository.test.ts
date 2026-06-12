import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { DWorkflowUpdate } from "@/data/types/domain/workflow";
import {
   WorkflowCreateArgs,
   WorkflowDeleteArgs,
   WorkflowFindManyArgs,
   WorkflowFindUniqueArgs,
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

      const result = await repository.pGetWorkflow(userId, workflowId);

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

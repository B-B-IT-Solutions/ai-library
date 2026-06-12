import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import {
   WorkflowFindManyArgs,
   WorkflowFindUniqueArgs,
} from "@/generated/prisma/models";

import { toDWorkflowDetail, toDWorkflows } from "./workflow.mapper";
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
      const row = ptestData.pWorkflowDetailRow(1);
      prismaMock.workflow.findUnique.mockResolvedValue(row);

      const result = await repository.pGetWorkflow(userId, workflowId);

      const expectedResult = toDWorkflowDetail(row);

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

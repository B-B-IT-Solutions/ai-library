import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { WorkflowFindManyArgs } from "@/generated/prisma/models";

import { toDWorkflows } from "./workflow.mapper";
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

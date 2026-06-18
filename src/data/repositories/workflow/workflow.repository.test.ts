import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import {
   DWorkflowsPage,
   DWorkflowsPageQuery,
   DWorkflowStepUpdate,
   DWorkflowUpdate,
} from "@/data/types/domain/workflow";
import {
   WorkflowCountArgs,
   WorkflowCreateArgs,
   WorkflowDeleteArgs,
   WorkflowFindManyArgs,
   WorkflowFindUniqueArgs,
   WorkflowStepCreateManyArgs,
   WorkflowStepDeleteManyArgs,
   WorkflowStepEdgeDeleteManyArgs,
   WorkflowStepUpdateArgs,
   WorkflowUpdateArgs,
   WorkflowWhereInput,
} from "@/generated/prisma/models";

import {
   toDWorkflow,
   toDWorkflows,
   toDWorkflowWithSteps,
} from "./workflow.mapper";
import { WorkflowRepository } from "./workflow.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const repository = new WorkflowRepository(prismaMock);

describe("pGetWorkflowsPage", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("query undefined - test", async () => {
      const userId = "user-id-1";
      const workflows = ptestData.pWorkflowWithStepCounts(3);
      const totalEntries = 15;
      prismaMock.workflow.findMany.mockResolvedValue(workflows);
      prismaMock.workflow.count.mockResolvedValue(totalEntries);

      const result = await repository.pGetWorkflowsPage(userId);

      const expectedResult: DWorkflowsPage = {
         content: toDWorkflows(workflows),
         pageNumber: 0,
         pageSize: 20,
         numberOfElements: workflows.length,
         totalPages: Math.ceil(totalEntries / 20),
         totalElements: totalEntries,
      };

      const expectedWhere: WorkflowWhereInput = {
         userId,
      };

      const expectedArgs: WorkflowFindManyArgs = {
         where: expectedWhere,
         include: { _count: { select: { steps: true } } },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: WorkflowCountArgs = {
         where: expectedWhere,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.workflow.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflow.findMany).toHaveBeenCalledWith(expectedArgs);
      expect(prismaMock.workflow.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflow.count).toHaveBeenCalledWith(expectedCountArgs);
   });

   it("sort createdAt asc - test", async () => {
      const userId = "user-id-1";
      const workflows = ptestData.pWorkflowWithStepCounts(10);
      const totalEntries = 15;
      prismaMock.workflow.findMany.mockResolvedValue(workflows);
      prismaMock.workflow.count.mockResolvedValue(totalEntries);

      const query: DWorkflowsPageQuery = {
         pagination: {
            pageNumber: 1,
            pageSize: 10,
         },
         filter: {
            search: "search-1",
         },
      };

      const result = await repository.pGetWorkflowsPage(userId, query);

      const expectedResult: DWorkflowsPage = {
         content: toDWorkflows(workflows),
         pageNumber: 1,
         pageSize: 10,
         numberOfElements: workflows.length,
         totalPages: Math.ceil(totalEntries / 10),
         totalElements: totalEntries,
      };

      const expectedWhere: WorkflowWhereInput = {
         userId,
         title: {
            contains: "search-1",
            mode: "insensitive" as const,
         },
      };

      const expectedArgs: WorkflowFindManyArgs = {
         where: expectedWhere,
         include: { _count: { select: { steps: true } } },
         orderBy: { createdAt: "desc" },
         skip: 10,
         take: 10,
      };

      const expectedCountArgs: WorkflowCountArgs = {
         where: expectedWhere,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.workflow.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflow.findMany).toHaveBeenCalledWith(expectedArgs);
      expect(prismaMock.workflow.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflow.count).toHaveBeenCalledWith(expectedCountArgs);
   });

   it("sort createdAt desc - test", async () => {
      const userId = "user-id-1";
      const workflows = ptestData.pWorkflowWithStepCounts(10);
      const totalEntries = 15;
      prismaMock.workflow.findMany.mockResolvedValue(workflows);
      prismaMock.workflow.count.mockResolvedValue(totalEntries);

      const query: DWorkflowsPageQuery = {
         pagination: {
            pageNumber: 2,
            pageSize: 5,
         },
         filter: {
            search: "search-1",
         },
         sort: { field: "createdAt", order: "asc" },
      };

      const result = await repository.pGetWorkflowsPage(userId, query);

      const expectedResult: DWorkflowsPage = {
         content: toDWorkflows(workflows),
         pageNumber: 2,
         pageSize: 5,
         numberOfElements: workflows.length,
         totalPages: Math.ceil(totalEntries / 5),
         totalElements: totalEntries,
      };

      const expectedWhere: WorkflowWhereInput = {
         userId,
         title: {
            contains: "search-1",
            mode: "insensitive" as const,
         },
      };

      const expectedArgs: WorkflowFindManyArgs = {
         where: expectedWhere,
         include: { _count: { select: { steps: true } } },
         orderBy: { createdAt: "asc" },
         skip: 10,
         take: 5,
      };

      const expectedCountArgs: WorkflowCountArgs = {
         where: expectedWhere,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.workflow.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflow.findMany).toHaveBeenCalledWith(expectedArgs);
      expect(prismaMock.workflow.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflow.count).toHaveBeenCalledWith(expectedCountArgs);
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
                  outgoingEdges: {
                     orderBy: {
                        order: "asc" as const,
                     },
                     include: {
                        toStep: {
                           select: { edgeId: true },
                        },
                     },
                  },
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
                  outgoingEdges: {
                     orderBy: { order: "asc" },
                     include: {
                        toStep: {
                           select: { edgeId: true },
                        },
                     },
                  },
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

      const createData = dtestData.dWorkflowUpdate();
      // const createData: DWorkflowUpdate = {
      //    title: workflow.title,
      //    description: workflow.description,
      //    steps: [],
      // };

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

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("updates workflow with correct args and returns mapped result - test", async () => {
      const userId = "user-id-1";
      const workflow = ptestData.pWorkflow(1);
      prismaMock.workflow.update.mockResolvedValue(workflow);
      prismaMock.workflowStep.findMany.mockResolvedValue([]);
      jest.spyOn(repository, "pDeleteWorkflowSteps").mockImplementation(async () => {});
      jest.spyOn(repository, "pCreateWorkflowSteps").mockImplementation(async () => {});
      jest.spyOn(repository, "pUpdateWorkflowSteps").mockImplementation(async () => {});

      const updateData = dtestData.dWorkflowUpdate();
      const result = await repository.pUpdateWorkflow(userId, workflow.id, updateData);

      const expectedResult = toDWorkflow(workflow);
      const expectedArgs: WorkflowUpdateArgs = {
         where: { id: workflow.id, userId },
         data: { title: updateData.title, description: updateData.description },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.workflow.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflow.update).toHaveBeenCalledWith(expectedArgs);
   });

   it("categorizes steps into new/updated/deleted groups - test", async () => {
      const userId = "user-id-1";
      const workflow = ptestData.pWorkflow(1);
      const existingStep = ptestData.pWorkflowStep(1);
      const stepToDelete = ptestData.pWorkflowStep(2);
      prismaMock.workflow.update.mockResolvedValue(workflow);
      prismaMock.workflowStep.findMany.mockResolvedValue([existingStep, stepToDelete]);

      const spyDelete = jest
         .spyOn(repository, "pDeleteWorkflowSteps")
         .mockImplementation(async () => {});
      const spyCreate = jest
         .spyOn(repository, "pCreateWorkflowSteps")
         .mockImplementation(async () => {});
      const spyUpdate = jest
         .spyOn(repository, "pUpdateWorkflowSteps")
         .mockImplementation(async () => {});

      const newStep = dtestData.dWorkflowStepUpdate(0);
      const updatedStep: DWorkflowStepUpdate = {
         ...dtestData.dWorkflowStepUpdate(1),
         id: existingStep.id,
      };
      const data: DWorkflowUpdate = {
         title: workflow.title,
         description: workflow.description,
         steps: [newStep, updatedStep],
      };

      await repository.pUpdateWorkflow(userId, workflow.id, data);

      expect(spyDelete).toHaveBeenCalledWith([stepToDelete.id]);
      expect(spyCreate).toHaveBeenCalledWith(workflow.id, [newStep]);
      expect(spyUpdate).toHaveBeenCalledWith([updatedStep]);
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

describe("pDeleteWorkflowSteps", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("empty list - no call - test", async () => {
      await repository.pDeleteWorkflowSteps([]);
      expect(prismaMock.workflowStep.deleteMany).not.toHaveBeenCalled();
   });

   it("deletes steps by ids - test", async () => {
      const ids = ["step-id-1", "step-id-2"];

      await repository.pDeleteWorkflowSteps(ids);

      const expectedArgs: WorkflowStepDeleteManyArgs = {
         where: { id: { in: ids } },
      };

      expect(prismaMock.workflowStep.deleteMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflowStep.deleteMany).toHaveBeenCalledWith(expectedArgs);
   });
});

describe("pCreateWorkflowSteps", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("empty list - no call - test", async () => {
      await repository.pCreateWorkflowSteps("workflow-id-1", []);
      expect(prismaMock.workflowStep.createMany).not.toHaveBeenCalled();
   });

   it("creates steps with all fields - test", async () => {
      const workflowId = "workflow-id-1";
      const step = dtestData.dWorkflowStepUpdate(0);

      await repository.pCreateWorkflowSteps(workflowId, [step]);

      const expectedArgs: WorkflowStepCreateManyArgs = {
         data: [
            {
               workflowId,
               title: step.title,
               hint: step.hint ?? null,
               type: step.type,
               promptId: step.promptId ?? null,
               content: step.content ?? null,
               edgeId: step.edgeId,
               isStart: step.isStart,
               position: step.position,
            },
         ],
      };

      expect(prismaMock.workflowStep.createMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflowStep.createMany).toHaveBeenCalledWith(expectedArgs);
   });
});

describe("pUpdateWorkflowSteps", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("empty list - no calls - test", async () => {
      await repository.pUpdateWorkflowSteps([]);
      expect(prismaMock.workflowStepEdge.deleteMany).not.toHaveBeenCalled();
      expect(prismaMock.workflowStep.update).not.toHaveBeenCalled();
   });

   it("deletes edges and updates step - test", async () => {
      const step: DWorkflowStepUpdate = {
         ...dtestData.dWorkflowStepUpdate(0),
         id: "step-id-1",
      };

      await repository.pUpdateWorkflowSteps([step]);

      const expectedDeleteEdgesArgs: WorkflowStepEdgeDeleteManyArgs = {
         where: { fromStepId: step.id! },
      };
      const expectedUpdateArgs: WorkflowStepUpdateArgs = {
         where: { id: step.id! },
         data: {
            title: step.title,
            hint: step.hint ?? null,
            type: step.type,
            promptId: step.promptId ?? null,
            content: step.content ?? null,
            isStart: step.isStart,
            position: step.position,
            outgoingEdges: {
               create: step.edges.map((e) => ({
                  toStepId: e.toStepId,
                  label: e.label,
                  order: e.order,
               })),
            },
         },
      };

      expect(prismaMock.workflowStepEdge.deleteMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflowStepEdge.deleteMany).toHaveBeenCalledWith(expectedDeleteEdgesArgs);
      expect(prismaMock.workflowStep.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflowStep.update).toHaveBeenCalledWith(expectedUpdateArgs);
   });

   it("processes each step independently - test", async () => {
      const step1: DWorkflowStepUpdate = {
         ...dtestData.dWorkflowStepUpdate(0),
         id: "step-id-1",
         edges: [],
      };
      const step2: DWorkflowStepUpdate = {
         ...dtestData.dWorkflowStepUpdate(1),
         id: "step-id-2",
         edges: [],
      };

      await repository.pUpdateWorkflowSteps([step1, step2]);

      expect(prismaMock.workflowStepEdge.deleteMany).toHaveBeenCalledTimes(2);
      expect(prismaMock.workflowStep.update).toHaveBeenCalledTimes(2);
   });
});

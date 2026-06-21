import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { map } from "es-toolkit/compat";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import {
   DWorkflowsPage,
   DWorkflowsPageQuery,
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
   WorkflowStepFindManyArgs,
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

      const newStep = dtestData.dWorkflowStepUpdate(0);
      newStep.id = undefined;

      const createData = dtestData.dWorkflowUpdate();
      createData.steps = [newStep];

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

      const expectedCreateStepsArgs: WorkflowStepCreateManyArgs = {
         data: [
            {
               workflowId: workflow.id,
               content: newStep.content,
               edgeId: newStep.edgeId,
               hint: newStep.hint,
               isStart: newStep.isStart,
               position: newStep.position,
               promptId: null,
               title: newStep.title,
               type: newStep.type,
            },
         ],
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.workflow.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflow.create).toHaveBeenCalledWith(expectedArgs);
      expect(prismaMock.workflowStep.createMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflowStep.createMany).toHaveBeenCalledWith(
         expectedCreateStepsArgs
      );
   });
});

describe("pUpdateWorkflow", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("workflow updated - test", async () => {
      const userId = "user-id-1";
      const workflow = ptestData.pWorkflow(1);
      const existingStep = ptestData.pWorkflowStep(1);
      const stepToDelete = ptestData.pWorkflowStep(2);
      prismaMock.workflow.update.mockResolvedValue(workflow);
      prismaMock.workflowStep.findMany.mockResolvedValue([
         existingStep,
         stepToDelete,
      ]);

      const newStep = dtestData.dWorkflowStepUpdate(0);
      newStep.id = undefined;

      const updatedStep = dtestData.dWorkflowStepUpdate(0);
      updatedStep.id = existingStep.id;

      const data: DWorkflowUpdate = {
         title: workflow.title,
         description: workflow.description,
         steps: [newStep, updatedStep],
      };

      await repository.pUpdateWorkflow(userId, workflow.id, data);

      const expecteUpdateWorkflowArgs: WorkflowUpdateArgs = {
         where: { id: workflow.id, userId },
         data: { title: data.title, description: data.description },
      };

      const expecttedFinAxistingStepsArgs: WorkflowStepFindManyArgs = {
         where: { workflowId: workflow.id },
         select: { id: true },
      };

      const expectedDeleteStepsArgs: WorkflowStepDeleteManyArgs = {
         where: { id: { in: [stepToDelete.id] } },
      };

      const expectedCreateStepsArgs: WorkflowStepCreateManyArgs = {
         data: [
            {
               workflowId: workflow.id,
               content: newStep.content,
               edgeId: newStep.edgeId,
               hint: newStep.hint,
               isStart: newStep.isStart,
               position: newStep.position,
               promptId: null,
               title: newStep.title,
               type: newStep.type,
            },
         ],
      };

      const expectedUpdateStepArgs: WorkflowStepUpdateArgs = {
         where: {
            id: updatedStep.id,
         },
         data: {
            content: updatedStep.content,
            hint: updatedStep.hint,
            isStart: updatedStep.isStart,
            position: updatedStep.position,
            promptId: null,
            title: updatedStep.title,
            type: updatedStep.type,
            outgoingEdges: {
               create: map(updatedStep.edges, (e) => ({
                  toStepEdgeId: e.toStepEdgeId,
                  label: e.label,
                  order: e.order,
               })),
            },
         },
      };

      expect(prismaMock.workflow.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflow.update).toHaveBeenCalledWith(
         expecteUpdateWorkflowArgs
      );
      expect(prismaMock.workflowStep.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflowStep.findMany).toHaveBeenCalledWith(
         expecttedFinAxistingStepsArgs
      );
      expect(prismaMock.workflowStep.deleteMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflowStep.deleteMany).toHaveBeenCalledWith(
         expectedDeleteStepsArgs
      );
      expect(prismaMock.workflowStep.createMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflowStep.createMany).toHaveBeenCalledWith(
         expectedCreateStepsArgs
      );
      expect(prismaMock.workflowStep.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflowStep.update).toHaveBeenCalledWith(
         expectedUpdateStepArgs
      );
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

describe("pCreateWorkflowSteps", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("steps empty - test", async () => {
      const workflowId = "workflow-id-1";
      await repository.pCreateWorkflowSteps(workflowId, []);
      expect(prismaMock.workflowStep.createMany).not.toHaveBeenCalled();
   });

   it("steps - all values defined - test", async () => {
      const workflowId = "workflow-id-1";
      const step = dtestData.dWorkflowStepUpdate(0);
      step.id = undefined;

      await repository.pCreateWorkflowSteps(workflowId, [step]);

      const expectedArgs: WorkflowStepCreateManyArgs = {
         data: [
            {
               workflowId,
               title: step.title,
               hint: step.hint,
               type: step.type,
               promptId: step.promptId,
               content: step.content,
               edgeId: step.edgeId,
               isStart: step.isStart,
               position: step.position,
            },
         ],
      };

      expect(prismaMock.workflowStep.createMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflowStep.createMany).toHaveBeenCalledWith(
         expectedArgs
      );
   });

   it("steps - some values undefined - test", async () => {
      const workflowId = "workflow-id-1";
      const step = dtestData.dWorkflowStepUpdate(0);
      step.id = undefined;
      step.hint = undefined;
      step.content = undefined;
      step.promptId = undefined;

      await repository.pCreateWorkflowSteps(workflowId, [step]);

      const expectedArgs: WorkflowStepCreateManyArgs = {
         data: [
            {
               workflowId,
               title: step.title,
               hint: null,
               type: step.type,
               promptId: null,
               content: null,
               edgeId: step.edgeId,
               isStart: step.isStart,
               position: step.position,
            },
         ],
      };

      expect(prismaMock.workflowStep.createMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflowStep.createMany).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pUpdateWorkflowSteps", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("steps empty - test", async () => {
      await repository.pUpdateWorkflowSteps([]);
      expect(prismaMock.workflowStepEdge.deleteMany).not.toHaveBeenCalled();
      expect(prismaMock.workflowStep.update).not.toHaveBeenCalled();
   });

   it("steps - all values defined - test - test", async () => {
      const step1 = dtestData.dWorkflowStepUpdate(1);
      const step2 = dtestData.dWorkflowStepUpdate(2);

      await repository.pUpdateWorkflowSteps([step1, step2]);

      const expectedDeleteEdgesArgs1: WorkflowStepEdgeDeleteManyArgs = {
         where: { fromStepEdgeId: step1.edgeId },
      };
      const expectedDeleteEdgesArgs2: WorkflowStepEdgeDeleteManyArgs = {
         where: { fromStepEdgeId: step2.edgeId },
      };

      const expectedUpdateArgs1: WorkflowStepUpdateArgs = {
         where: { id: step1.id! },
         data: {
            title: step1.title,
            hint: step1.hint,
            type: step1.type,
            promptId: step1.promptId,
            content: step1.content,
            isStart: step1.isStart,
            position: step1.position,
            outgoingEdges: {
               create: step1.edges.map((e) => ({
                  toStepEdgeId: e.toStepEdgeId,
                  label: e.label,
                  order: e.order,
               })),
            },
         },
      };
      const expectedUpdateArgs2: WorkflowStepUpdateArgs = {
         where: { id: step2.id! },
         data: {
            title: step2.title,
            hint: step2.hint,
            type: step2.type,
            promptId: step2.promptId,
            content: step2.content,
            isStart: step2.isStart,
            position: step2.position,
            outgoingEdges: {
               create: step2.edges.map((e) => ({
                  toStepEdgeId: e.toStepEdgeId,
                  label: e.label,
                  order: e.order,
               })),
            },
         },
      };

      expect(prismaMock.workflowStepEdge.deleteMany).toHaveBeenCalledTimes(2);
      expect(prismaMock.workflowStepEdge.deleteMany).toHaveBeenNthCalledWith(
         1,
         expectedDeleteEdgesArgs1
      );
      expect(prismaMock.workflowStepEdge.deleteMany).toHaveBeenNthCalledWith(
         2,
         expectedDeleteEdgesArgs2
      );
      expect(prismaMock.workflowStep.update).toHaveBeenCalledTimes(2);
      expect(prismaMock.workflowStep.update).toHaveBeenNthCalledWith(
         1,
         expectedUpdateArgs1
      );
      expect(prismaMock.workflowStep.update).toHaveBeenNthCalledWith(
         2,
         expectedUpdateArgs2
      );
   });

   it("steps - some values undefined - test - test", async () => {
      const step = dtestData.dWorkflowStepUpdate(0);
      step.hint = undefined;
      step.content = undefined;
      step.promptId = undefined;

      await repository.pUpdateWorkflowSteps([step]);

      const expectedDeleteEdgesArgs: WorkflowStepEdgeDeleteManyArgs = {
         where: { fromStepEdgeId: step.edgeId },
      };
      const expectedUpdateArgs: WorkflowStepUpdateArgs = {
         where: { id: step.id! },
         data: {
            title: step.title,
            hint: null,
            type: step.type,
            promptId: null,
            content: null,
            isStart: step.isStart,
            position: step.position,
            outgoingEdges: {
               create: step.edges.map((e) => ({
                  toStepEdgeId: e.toStepEdgeId,
                  label: e.label,
                  order: e.order,
               })),
            },
         },
      };

      expect(prismaMock.workflowStepEdge.deleteMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflowStepEdge.deleteMany).toHaveBeenCalledWith(
         expectedDeleteEdgesArgs
      );
      expect(prismaMock.workflowStep.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.workflowStep.update).toHaveBeenCalledWith(
         expectedUpdateArgs
      );
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
      expect(prismaMock.workflowStep.deleteMany).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

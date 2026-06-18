import { filter, includes, isEmpty, map } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import {
   DWorkflow,
   DWorkflowsPage,
   DWorkflowsPageQuery,
   DWorkflowStepUpdate,
   DWorkflowStepWithOutgoingEdges,
   DWorkflowUpdate,
   DWorkflowWithSteps,
} from "@/data/types/domain/workflow";
import {
   WorkflowCountArgs,
   WorkflowCreateArgs,
   WorkflowCreateInput,
   WorkflowDeleteArgs,
   WorkflowFindManyArgs,
   WorkflowFindUniqueArgs,
   WorkflowFindUniqueOrThrowArgs,
   WorkflowStepCreateArgs,
   WorkflowStepCreateManyArgs,
   WorkflowStepCreateManyInput,
   WorkflowStepDeleteManyArgs,
   WorkflowStepEdgeCreateWithoutFromStepInput,
   WorkflowStepFindManyArgs,
   WorkflowStepUpdateManyArgs,
   WorkflowStepUpdateManyMutationInput,
} from "@/generated/prisma/models";

import { resolveOrderBy, resolveWhereInput } from "./utils";
import {
   toDWorkflow,
   toDWorkflows,
   toDWorkflowWithSteps,
} from "./workflow.mapper";

export class WorkflowRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetWorkflowsPage(
      userId: string,
      query?: DWorkflowsPageQuery
   ): Promise<DWorkflowsPage> {
      const pagination = query?.pagination;
      const pageNumber = pagination?.pageNumber ?? 0;
      const pageSize = pagination?.pageSize ?? 20;
      const skip = pageNumber * pageSize;

      const where = resolveWhereInput(userId, query?.filter);
      const orderBy = resolveOrderBy(query?.sort);

      const args = {
         where,
         include: { _count: { select: { steps: true } } },
         orderBy,
         skip,
         take: pageSize,
      } satisfies WorkflowFindManyArgs;

      const [workflows, totalElements] = await Promise.all([
         this.prisma.workflow.findMany(args),
         this.prisma.workflow.count({ where }),
      ]);

      return {
         content: toDWorkflows(workflows),
         pageNumber,
         pageSize,
         numberOfElements: workflows.length,
         totalPages: Math.ceil(totalElements / pageSize),
         totalElements,
      };
   }

   async pGetWorkflowsCount(userId: string): Promise<number> {
      const args = {
         where: { userId },
      } satisfies WorkflowCountArgs;
      return this.prisma.workflow.count(args);
   }

   async pGetWorkflow(
      userId: string,
      workflowId: string
   ): Promise<DWorkflow | null> {
      const args = {
         where: {
            id: workflowId,
            userId,
         },
      } satisfies WorkflowFindUniqueArgs;

      const data = await this.prisma.workflow.findUnique(args);
      if (!data) {
         return null;
      }
      return toDWorkflow(data);
   }

   async pGetWorkflowWithSteps(
      userId: string,
      workflowId: string
   ): Promise<DWorkflowWithSteps | null> {
      const args = {
         where: { id: workflowId, userId },
         include: {
            steps: {
               orderBy: {
                  position: "asc" as const,
               },
               include: {
                  prompt: {
                     select: { title: true },
                  },
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
      } satisfies WorkflowFindUniqueArgs;

      const data = await this.prisma.workflow.findUnique(args);
      if (!data) {
         return null;
      }
      return toDWorkflowWithSteps(data);
   }

   async pCreateWorkflow(
      userId: string,
      data: DWorkflowUpdate
   ): Promise<DWorkflow> {
      const input: WorkflowCreateInput = {
         title: data.title,
         description: data.description,
         user: {
            connect: {
               id: userId,
            },
         },
      };
      const args = {
         data: input,
      } satisfies WorkflowCreateArgs;

      const workflow = await this.prisma.workflow.create(args);
      return toDWorkflow(workflow);
   }

   async pUpdateWorkflow(
      userId: string,
      workflowId: string,
      data: DWorkflowUpdate
   ): Promise<DWorkflow> {
      const workflow = await this.prisma.workflow.update({
         where: { id: workflowId, userId },
         data: { title: data.title, description: data.description },
      });

      const existingStepsArgs = {
         where: { workflowId },
         select: { id: true, edgeId: true },
      } satisfies WorkflowStepFindManyArgs;

      const existingSteps =
         await this.prisma.workflowStep.findMany(existingStepsArgs);

      const existingByEdgeId = new Map(
         map(existingSteps, (s) => [s.edgeId, s.id])
      );

      const existingStepIds = map(existingSteps, (s) => s.id);

      const newSteps = filter(data.steps, (s) => !s.id);

      const updatedSteps = filter(data.steps, (s) =>
         includes(existingStepIds, s.id)
      );
      const updatedStepIds = map(updatedSteps, (s) => s.id!);

      const deletedSteps = filter(
         data.steps,
         (s) => !includes(existingStepIds, s.id)
      );
      const deletedStepIds = map(deletedSteps, (s) => s.id!);

      await this._deleteRemovedSteps(deletedStepIds);
      await this._createNewWorkflowSteps(workflowId, newSteps);
      await this._enforceStartStep(workflowId, data.steps, existingByEdgeId);
      await this._updateWorkflowSteps(updatedSteps);

      return toDWorkflow(workflow);
   }

   private async _deleteRemovedSteps(stepIdsToDelete: string[]) {
      if (!isEmpty(stepIdsToDelete)) {
         const args = {
            where: { id: { in: stepIdsToDelete } },
         } satisfies WorkflowStepDeleteManyArgs;

         await this.prisma.workflowStep.deleteMany(args);
      }
   }

   private async _createNewWorkflowSteps(
      workflowId: string,
      steps: DWorkflowStepUpdate[]
   ) {
      const inputAgrs = map(steps, (step) => {
         return {
            workflowId,
            title: step.title,
            hint: step.hint ?? null,
            type: step.type,
            promptId: step.promptId ?? null,
            content: step.content ?? null,
            edgeId: step.edgeId,
            isStart: step.isStart,
            position: step.position,
         };
      }) satisfies WorkflowStepCreateManyInput[];

      const createManyArgs = {
         data: inputAgrs,
      } satisfies WorkflowStepCreateManyArgs;

      await this.prisma.workflowStep.createMany(createManyArgs);
   }

   private async _updateWorkflowSteps(steps: DWorkflowStepUpdate[]) {
      // const whereArgs: WorkflowStepEdgeWhereInput[] = map(steps, (s) => {
      //    return {
      //       where: { id: s.id! },
      //    };
      // });

      // const deleteEdgeArgs = map(steps, (s) => {
      //    return {
      //       where: { stepId: s.id! },
      //    };
      // }) satisfies WorkflowStepEdgeDeleteManyArgs;

      // await this.prisma.workflowStepEdge.deleteMany(deleteEdgeArgs);

      const inputAgrs: WorkflowStepUpdateManyMutationInput[] = map(
         steps,
         (step) => {
            return {
               title: step.title,
               hint: step.hint ?? null,
               type: step.type,
               promptId: step.promptId ?? null,
               content: step.content ?? null,
               isStart: step.isStart,
               position: step.position,
               outgoingEdges: {
                  create: map(step.edges, (e) => ({
                     toStepId: e.toStepId,
                     label: e.label,
                     order: e.order,
                  })),
                  delete: {},
               },
            };
         }
      );

      const updateManyArgs = {
         data: inputAgrs,
      } satisfies WorkflowStepUpdateManyArgs;

      await this.prisma.workflowStep.updateMany(updateManyArgs);
   }

   private async _enforceStartStep(
      workflowId: string,
      steps: DWorkflowStepUpdate[],
      existingByEdgeId: Map<string, string>
   ): Promise<void> {
      const startStep = steps.find((s) => s.isStart);
      if (startStep) {
         const startStepDbId = existingByEdgeId.get(startStep.edgeId);
         await this.prisma.workflowStep.updateMany({
            where: { workflowId, id: { not: startStepDbId } },
            data: { isStart: false },
         });
      } else {
         await this.prisma.workflowStep.updateMany({
            where: { workflowId },
            data: { isStart: false },
         });
      }
   }

   async pDeleteWorkflow(userId: string, workflowId: string) {
      const args = {
         where: {
            id: workflowId,
            userId,
         },
      } satisfies WorkflowDeleteArgs;

      await this.prisma.workflow.delete(args);
   }

   async pCountWorkflowSteps(workflowId: string): Promise<number> {
      return this.prisma.workflowStep.count({ where: { workflowId } });
   }

   async pCreateWorkflowStep(
      userId: string,
      workflowId: string,
      data: DWorkflowStepUpdate
   ): Promise<DWorkflowWithSteps> {
      // If isStart is set, unset any existing start step first
      if (data.isStart) {
         const args = {
            where: { workflowId },
            data: { isStart: false },
         } satisfies WorkflowStepUpdateManyArgs;

         await this.prisma.workflowStep.updateMany(args);
      }

      const edgesArgs: WorkflowStepEdgeCreateWithoutFromStepInput[] = map(
         data.edges,
         (e) => {
            return {
               label: e.label,
               order: e.order,
               toStep: {
                  connect: {
                     id: e.toStepId,
                  },
               },
            };
         }
      );

      const args = {
         data: {
            workflowId,
            title: data.title,
            hint: data.hint ?? null,
            type: data.type,
            promptId: data.promptId,
            content: data.content,
            edgeId: data.edgeId,
            isStart: data.isStart,
            position: data.position,
            outgoingEdges: {
               create: edgesArgs,
            },
         },
      } satisfies WorkflowStepCreateArgs;

      await this.prisma.workflowStep.create(args);

      const argsWorkflow = {
         where: { id: workflowId, userId },
         include: {
            _count: { select: { steps: true } },
            steps: {
               orderBy: {
                  position: "asc" as const,
               },
               include: {
                  prompt: {
                     select: { title: true },
                  },
                  outgoingEdges: {
                     orderBy: { order: "asc" as const },
                     include: { toStep: { select: { edgeId: true } } },
                  },
               },
            },
         },
      } satisfies WorkflowFindUniqueOrThrowArgs;

      const workflow =
         await this.prisma.workflow.findUniqueOrThrow(argsWorkflow);

      return toDWorkflowWithSteps(workflow);
   }

   async pUpdateWorkflowStep(
      userId: string,
      stepId: string,
      data: DWorkflowStepUpdate
   ): Promise<DWorkflowWithSteps> {
      // Verify ownership
      const step = await this.prisma.workflowStep.findFirstOrThrow({
         where: { id: stepId, workflow: { userId } },
         select: { workflowId: true },
      });
      const { workflowId } = step;

      await this.prisma.$transaction(async (tx) => {
         // If isStart toggled on, unset others
         if (data.isStart) {
            await tx.workflowStep.updateMany({
               where: { workflowId, id: { not: stepId } },
               data: { isStart: false },
            });
         }

         // Replace all outgoing edges
         await tx.workflowStepEdge.deleteMany({
            where: { fromStepId: stepId },
         });

         await tx.workflowStep.update({
            where: { id: stepId },
            data: {
               title: data.title,
               hint: data.hint ?? null,
               type: data.type,
               promptId: data.promptId,
               content: data.content,
               isStart: data.isStart,
               position: data.position,
               outgoingEdges: {
                  create: map(data.edges ?? [], (e) => ({
                     toStepId: e.toStepId,
                     label: e.label,
                     order: e.order,
                  })),
               },
            },
         });
      });

      const workflow = await this.prisma.workflow.findUniqueOrThrow({
         where: { id: workflowId, userId },
         include: {
            _count: { select: { steps: true } },
            steps: {
               orderBy: {
                  position: "asc" as const,
               },
               include: {
                  prompt: {
                     select: { title: true },
                  },
                  outgoingEdges: {
                     orderBy: { order: "asc" as const },
                     include: { toStep: { select: { edgeId: true } } },
                  },
               },
            },
         },
      });
      return toDWorkflowWithSteps(workflow);
   }

   async pDeleteWorkflowStep(
      userId: string,
      stepId: string
   ): Promise<DWorkflowWithSteps> {
      const step = await this.prisma.workflowStep.findFirstOrThrow({
         where: { id: stepId, workflow: { userId } },
         select: { workflowId: true },
      });
      const { workflowId } = step;

      await this.prisma.workflowStep.delete({ where: { id: stepId } });

      const workflow = await this.prisma.workflow.findUniqueOrThrow({
         where: { id: workflowId, userId },
         include: {
            _count: { select: { steps: true } },
            steps: {
               orderBy: {
                  position: "asc" as const,
               },
               include: {
                  prompt: {
                     select: { title: true },
                  },
                  outgoingEdges: {
                     orderBy: { order: "asc" as const },
                     include: { toStep: { select: { edgeId: true } } },
                  },
               },
            },
         },
      });
      return toDWorkflowWithSteps(workflow);
   }

   async pSetStartStep(
      userId: string,
      workflowId: string,
      stepId: string
   ): Promise<void> {
      await this.prisma.$transaction([
         this.prisma.workflowStep.updateMany({
            where: { workflowId, workflow: { userId } },
            data: { isStart: false },
         }),
         this.prisma.workflowStep.update({
            where: { id: stepId },
            data: { isStart: true },
         }),
      ]);
   }

   async pGetWorkflowStepsForCycleCheck(
      workflowId: string
   ): Promise<DWorkflowStepWithOutgoingEdges[]> {
      const args = {
         where: { workflowId },
         select: {
            id: true,
            outgoingEdges: {
               select: { toStepId: true },
            },
         },
      } satisfies WorkflowStepFindManyArgs;

      return this.prisma.workflowStep.findMany(args);
   }
}

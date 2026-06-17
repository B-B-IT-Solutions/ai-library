import { map } from "es-toolkit/compat";

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
   WorkflowStepEdgeCreateWithoutFromStepInput,
   WorkflowStepFindManyArgs,
   WorkflowStepUpdateManyArgs,
   WorkflowUpdateArgs,
   WorkflowUpdateInput,
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
      const input: WorkflowUpdateInput = {
         title: data.title,
         description: data.description,
      };
      const args = {
         where: {
            id: workflowId,
            userId,
         },
         data: input,
      } satisfies WorkflowUpdateArgs;

      const workflow = await this.prisma.workflow.update(args);
      return toDWorkflow(workflow);
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
               templateId: data.promptId,
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

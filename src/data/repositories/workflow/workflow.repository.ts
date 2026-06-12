import { map } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import {
   DWorkflow,
   DWorkflowCreate,
   DWorkflowDetail,
   DWorkflowStepCreate,
   DWorkflowStepUpdate,
   DWorkflowUpdate,
} from "@/data/types/domain/workflow";
import {
   WorkflowFindManyArgs,
   WorkflowFindUniqueArgs,
} from "@/generated/prisma/models";

import { toDWorkflowDetail, toDWorkflows } from "./workflow.mapper";

const STEP_INCLUDE = {
   template: {
      select: { title: true },
   },
   outgoingEdges: {
      orderBy: { order: "asc" as const },
   },
} as const;

const WORKFLOW_DETAIL_INCLUDE = {
   _count: { select: { steps: true } },
   steps: {
      orderBy: {
         position: "asc" as const,
      },
      include: STEP_INCLUDE,
   },
} as const;

export class WorkflowRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetWorkflows(userId: string): Promise<DWorkflow[]> {
      const args = {
         where: { userId },
         include: { _count: { select: { steps: true } } },
         orderBy: { createdAt: "desc" },
      } satisfies WorkflowFindManyArgs;

      const data = await this.prisma.workflow.findMany(args);
      return toDWorkflows(data);
   }

   async pCountWorkflows(userId: string): Promise<number> {
      return this.prisma.workflow.count({ where: { userId } });
   }

   async pGetWorkflow(
      userId: string,
      workflowId: string
   ): Promise<DWorkflowDetail | null> {
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
      return toDWorkflowDetail(data);
   }

   async pCreateWorkflow(
      userId: string,
      data: DWorkflowCreate
   ): Promise<DWorkflowDetail> {
      const row = await this.prisma.workflow.create({
         data: {
            userId,
            title: data.title,
            description: data.description ?? null,
         },
         include: WORKFLOW_DETAIL_INCLUDE,
      });
      return toDWorkflowDetail(row as Parameters<typeof toDWorkflowDetail>[0]);
   }

   async pUpdateWorkflow(
      userId: string,
      workflowId: string,
      data: DWorkflowUpdate
   ): Promise<DWorkflowDetail> {
      const row = await this.prisma.workflow.update({
         where: { id: workflowId, userId },
         data: {
            title: data.title,
            description: data.description ?? null,
         },
         include: WORKFLOW_DETAIL_INCLUDE,
      });
      return toDWorkflowDetail(row as Parameters<typeof toDWorkflowDetail>[0]);
   }

   async pDeleteWorkflow(userId: string, workflowId: string): Promise<void> {
      await this.prisma.workflow.delete({
         where: { id: workflowId, userId },
      });
   }

   async pCountWorkflowSteps(workflowId: string): Promise<number> {
      return this.prisma.workflowStep.count({ where: { workflowId } });
   }

   async pCreateWorkflowStep(
      userId: string,
      workflowId: string,
      data: DWorkflowStepCreate
   ): Promise<DWorkflowDetail> {
      // If isStart is set, unset any existing start step first
      if (data.isStart) {
         await this.prisma.workflowStep.updateMany({
            where: { workflowId },
            data: { isStart: false },
         });
      }

      await this.prisma.workflowStep.create({
         data: {
            workflowId,
            title: data.title,
            hint: data.hint ?? null,
            type: data.type,
            templateId: data.templateId ?? null,
            content: data.content ?? null,
            isStart: data.isStart ?? false,
            position: data.position ?? 0,
            outgoingEdges: {
               create: map(data.edges ?? [], (e) => ({
                  toStepId: e.toStepId,
                  label: e.label,
                  order: e.order,
               })),
            },
         },
      });

      const workflow = await this.prisma.workflow.findUniqueOrThrow({
         where: { id: workflowId, userId },
         include: WORKFLOW_DETAIL_INCLUDE,
      });
      return toDWorkflowDetail(
         workflow as Parameters<typeof toDWorkflowDetail>[0]
      );
   }

   async pUpdateWorkflowStep(
      userId: string,
      stepId: string,
      data: DWorkflowStepUpdate
   ): Promise<DWorkflowDetail> {
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
               templateId: data.templateId ?? null,
               content: data.content ?? null,
               isStart: data.isStart ?? false,
               position: data.position ?? 0,
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
         include: WORKFLOW_DETAIL_INCLUDE,
      });
      return toDWorkflowDetail(
         workflow as Parameters<typeof toDWorkflowDetail>[0]
      );
   }

   async pDeleteWorkflowStep(
      userId: string,
      stepId: string
   ): Promise<DWorkflowDetail> {
      const step = await this.prisma.workflowStep.findFirstOrThrow({
         where: { id: stepId, workflow: { userId } },
         select: { workflowId: true },
      });
      const { workflowId } = step;

      await this.prisma.workflowStep.delete({ where: { id: stepId } });

      const workflow = await this.prisma.workflow.findUniqueOrThrow({
         where: { id: workflowId, userId },
         include: WORKFLOW_DETAIL_INCLUDE,
      });
      return toDWorkflowDetail(
         workflow as Parameters<typeof toDWorkflowDetail>[0]
      );
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

   async pGetStepsForCycleCheck(
      workflowId: string
   ): Promise<
      Array<{ id: string; outgoingEdges: Array<{ toStepId: string }> }>
   > {
      return this.prisma.workflowStep.findMany({
         where: { workflowId },
         select: {
            id: true,
            outgoingEdges: { select: { toStepId: true } },
         },
      });
   }
}

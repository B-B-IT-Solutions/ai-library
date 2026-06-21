import { filter, includes, isEmpty, map } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import {
   DWorkflow,
   DWorkflowsPage,
   DWorkflowsPageQuery,
   DWorkflowStepUpdate,
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
   WorkflowStepCreateManyArgs,
   WorkflowStepCreateManyInput,
   WorkflowStepDeleteManyArgs,
   WorkflowStepEdgeDeleteManyArgs,
   WorkflowStepFindManyArgs,
   WorkflowStepUpdateArgs,
   WorkflowUpdateArgs,
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

      await this.pCreateWorkflowSteps(workflow.id, data.steps);

      return toDWorkflow(workflow);
   }

   async pUpdateWorkflow(
      userId: string,
      workflowId: string,
      data: DWorkflowUpdate
   ): Promise<DWorkflow> {
      const updateWorkflowArgs = {
         where: { id: workflowId, userId },
         data: { title: data.title, description: data.description },
      } satisfies WorkflowUpdateArgs;

      const workflow = await this.prisma.workflow.update(updateWorkflowArgs);

      const existingStepsArgs = {
         where: { workflowId },
         select: { id: true },
      } satisfies WorkflowStepFindManyArgs;

      const existingSteps =
         await this.prisma.workflowStep.findMany(existingStepsArgs);

      const existingStepIds = map(existingSteps, (s) => s.id);
      const submittedStepIds = new Set(
         map(
            filter(data.steps, (s) => !!s.id),
            (s) => s.id!
         )
      );
      const deletedStepIds = map(
         filter(existingSteps, (s) => !submittedStepIds.has(s.id)),
         (s) => s.id
      );

      const newSteps = filter(data.steps, (s) => !s.id);
      const updatedSteps = filter(data.steps, (s) =>
         includes(existingStepIds, s.id)
      );

      await this.pDeleteWorkflowSteps(deletedStepIds);
      await this.pCreateWorkflowSteps(workflowId, newSteps);
      await this.pUpdateWorkflowSteps(updatedSteps);

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

   async pCreateWorkflowSteps(
      workflowId: string,
      steps: DWorkflowStepUpdate[]
   ) {
      if (!isEmpty(steps)) {
         const inputArgs = map(steps, (step) => {
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
            } satisfies WorkflowStepCreateManyInput;
         }) satisfies WorkflowStepCreateManyInput[];

         await this.prisma.workflowStep.createMany({
            data: inputArgs,
         } satisfies WorkflowStepCreateManyArgs);
      }
   }

   async pUpdateWorkflowSteps(steps: DWorkflowStepUpdate[]) {
      for (const step of steps) {
         const id = step.id!;
         const edgeId = step.edgeId;
         const deleteEdgesArgs = {
            where: { fromStepEdgeId: edgeId },
         } satisfies WorkflowStepEdgeDeleteManyArgs;

         await this.prisma.workflowStepEdge.deleteMany(deleteEdgesArgs);

         const updateStepsArgs = {
            where: { id: id },
            data: {
               title: step.title,
               hint: step.hint ?? null,
               type: step.type,
               promptId: step.promptId ?? null,
               content: step.content ?? null,
               isStart: step.isStart,
               position: step.position,
               outgoingEdges: {
                  create: map(step.edges, (e) => ({
                     // fromStepEdgeId: edgeId,
                     toStepEdgeId: e.toStepEdgeId,
                     label: e.label,
                     order: e.order,
                  })),
               },
            },
         } satisfies WorkflowStepUpdateArgs;

         await this.prisma.workflowStep.update(updateStepsArgs);
      }
   }

   async pDeleteWorkflowSteps(stepIdsToDelete: string[]) {
      if (!isEmpty(stepIdsToDelete)) {
         const args = {
            where: { id: { in: stepIdsToDelete } },
         } satisfies WorkflowStepDeleteManyArgs;

         await this.prisma.workflowStep.deleteMany(args);
      }
   }
}

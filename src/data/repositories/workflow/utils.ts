import { Sort } from "@/data/types/common";
import { DWorkflowsFilter } from "@/data/types/domain/workflow";
import {
   WorkflowOrderByWithRelationInput,
   WorkflowWhereInput,
} from "@/generated/prisma/models/Workflow";

export const resolveWhereInput = (
   userId: string,
   filter?: DWorkflowsFilter
): WorkflowWhereInput => {
   const where: WorkflowWhereInput = { userId };

   if (filter?.search) {
      where.title = {
         contains: filter.search,
         mode: "insensitive",
      };
   }

   return where;
};

export const resolveOrderBy = (
   sort?: Sort
): WorkflowOrderByWithRelationInput => {
   if (sort) {
      return { [sort.field]: sort.order };
   }
   return { createdAt: "desc" };
};

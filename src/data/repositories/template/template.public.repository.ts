import { DbClient } from "@/data/types/db/common";
import { PromptTemplateDescriptorWithCategories } from "@/data/types/db/prompt.template";
import {
   DPromptTemplate,
   DPromptTemplateDescriptor,
   DTemplateDescriptorsPage,
   DTemplateDescriptorsPageQuery,
} from "@/data/types/domain/prompt.template";
import {
   PromptContentFindFirstArgs,
   PromptTemplateDescriptorCountArgs,
   PromptTemplateDescriptorFindFirstArgs,
   PromptTemplateDescriptorFindManyArgs,
} from "@/generated/prisma/models";

import {
   toDPromptTemplate,
   toDTemplateDescriptor,
   toDTemplateDescriptors,
} from "./template.mapper";
import { resolveOrderBy, resolveWhereInput } from "./utils";

export class PublicTemplateRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetPublicTemplateDescriptorsPage(
      query: DTemplateDescriptorsPageQuery
   ): Promise<DTemplateDescriptorsPage> {
      const pagination = query.pagination;
      const pageNumber = pagination?.pageNumber ?? 0;
      const pageSize = pagination?.pageSize ?? 20;
      const skip = pageNumber * pageSize;

      const where = resolveWhereInput(undefined, query.filter);
      const orderBy = resolveOrderBy(query.sort);

      const args: PromptTemplateDescriptorFindManyArgs = {
         where,
         include: {
            categories: true,
         },
         orderBy,
         skip,
         take: pageSize,
      };

      const countArgs: PromptTemplateDescriptorCountArgs = {
         where,
      };

      const [descriptors, totalElements] = await Promise.all([
         this.prisma.promptTemplateDescriptor.findMany(args) as Promise<
            PromptTemplateDescriptorWithCategories[]
         >,
         this.prisma.promptTemplateDescriptor.count(countArgs),
      ]);

      return {
         content: toDTemplateDescriptors(descriptors),
         pageNumber,
         pageSize,
         numberOfElements: descriptors.length,
         totalPages: Math.ceil(totalElements / pageSize),
         totalElements: totalElements,
      };
   }

   async pGetPublicTemplateDescriptor(
      id: string
   ): Promise<DPromptTemplateDescriptor | null> {
      const args = {
         where: { id },
         include: {
            categories: true,
         },
      } satisfies PromptTemplateDescriptorFindFirstArgs;

      const descriptor: PromptTemplateDescriptorWithCategories | null =
         await this.prisma.promptTemplateDescriptor.findFirst(args);

      return descriptor ? toDTemplateDescriptor(descriptor) : null;
   }

   async pGetPublicPromptTemplate(id: string): Promise<DPromptTemplate | null> {
      const args = {
         where: {
            id,
         },
         include: {
            fields: true,
            globalFields: true,
         },
      } satisfies PromptContentFindFirstArgs;

      const template = await this.prisma.promptContent.findFirst(args);

      return template ? toDPromptTemplate(template) : null;
   }
}

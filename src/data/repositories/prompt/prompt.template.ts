import { isEmpty } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import { PromptTemplateDescriptorWithCategories } from "@/data/types/db/prompt.template";
import { Prisma } from "@/generated/prisma/client";
import { PromptTemplateDescriptorWhereInput } from "@/generated/prisma/models";

type PGetPromptTemplateDescriptorsParams = {
   search?: string;
   categories?: string[];
};

export class PromptTemplateRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetPromptTemplateDescriptors(
      params?: PGetPromptTemplateDescriptorsParams
   ) {
      const where = this.resolveGetPromptTemplateDescriptorsWhereInput(params);
      return await this.prisma.promptTemplateDescriptor.findMany({
         where: where,
         include: {
            categories: true,
         },
         take: 20,
      });
   }

   async pGetPromptTemplateDescriptor(
      id: string
   ): Promise<PromptTemplateDescriptorWithCategories | null> {
      return await this.prisma.promptTemplateDescriptor.findFirst({
         where: { id },
         include: {
            categories: true,
         },
      });
   }

   async pGetPromptTemplateCategories() {
      return await this.prisma.promptTemplateCategory.findMany({
         select: {
            name: true,
         },
      });
   }

   private resolveGetPromptTemplateDescriptorsWhereInput(
      params?: PGetPromptTemplateDescriptorsParams
   ): PromptTemplateDescriptorWhereInput | undefined {
      if (isEmpty(params)) {
         return undefined;
      }

      const { search, categories } = params;

      const searchClause:
         | Prisma.PromptTemplateDescriptorWhereInput[]
         | undefined = search
         ? [
              {
                 title: {
                    contains: search,
                    mode: "insensitive",
                 },
              },
              {
                 promptTemplate: {
                    promptText: {
                       contains: search,
                       mode: "insensitive",
                    },
                 },
              },
           ]
         : undefined;

      const isCategories = !isEmpty(categories);
      const categoriesClause:
         | Prisma.PromptTemplateDescriptorWhereInput[]
         | undefined = isCategories
         ? [
              {
                 categories: {
                    some: {
                       name: {
                          in: categories,
                       },
                    },
                 },
              },
           ]
         : undefined;

      return {
         OR: searchClause,
         AND: categoriesClause,
      };
   }
}

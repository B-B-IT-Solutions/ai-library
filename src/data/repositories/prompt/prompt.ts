import { isEmpty } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import {
   PromptDescriptorsPage,
   PromptDescriptorsPageQuery,
   PromptDescriptorWithCategories,
} from "@/data/types/db/prompt";
import {
   PromptCreateInput,
   PromptDescriptorWhereInput,
   PromptUpdateInput,
} from "@/generated/prisma/models";
import { DEFAULT_PAGINATION } from "../utils";

export type GetPromptQuery = {
   id: string;
};

export class PromptRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetPromptDescriptors(
      query?: PromptDescriptorsPageQuery
   ): Promise<PromptDescriptorsPage> {
      const { pagination } = query || {};
      const { pageNumber, pageSize } = pagination || DEFAULT_PAGINATION;

      const whereClause = this.resolveGetPromptDescriptorsWhereInput(query);

      const [data, count] = await this.prisma.$transaction([
         this.prisma.promptDescriptor.findMany({
            where: whereClause,
            skip: pageNumber * pageSize,
            take: pageSize,
            include: {
               categories: true,
            },
         }),
         this.prisma.promptDescriptor.count({
            where: whereClause,
         }),
      ]);

      return {
         content: data,
         numberOfElements: data.length,
         pageNumber: pageNumber,
         pageSize: pageSize,
         totalElements: count,
         totalPages: Math.ceil(count / pageSize),
      };
   }

   async pGetPromptDescriptor(
      query: GetPromptQuery
   ): Promise<PromptDescriptorWithCategories | null> {
      const { id } = query;
      return await this.prisma.promptDescriptor.findFirst({
         where: { id },
         include: {
            categories: true,
         },
      });
   }

   async pGetPromptCategories() {
      return await this.prisma.promptCategory.findMany({
         select: {
            name: true,
         },
      });
   }

   async pCreatePrompt(data: PromptCreateInput) {
      return await this.prisma.prompt.create({
         data: {
            content: data.content,
            descriptor: data.descriptor,
         },
      });
   }

   async pUpdatePrompt(promptId: string, data: PromptUpdateInput) {
      return await this.prisma.prompt.update({
         where: { id: promptId },
         data: {
            content: data.content,
            descriptor: data.descriptor,
         },
      });
   }

   private resolveGetPromptDescriptorsWhereInput(
      query?: PromptDescriptorsPageQuery
   ): PromptDescriptorWhereInput | undefined {
      if (isEmpty(query)) {
         return undefined;
      }

      const { globalFilter } = query;
      const { categories } = query.filter || {};

      const searchClause: PromptDescriptorWhereInput[] | undefined =
         globalFilter
            ? [
                 {
                    title: {
                       contains: globalFilter,
                       mode: "insensitive",
                    },
                 },
                 {
                    prompt: {
                       content: {
                          contains: globalFilter,
                          mode: "insensitive",
                       },
                    },
                 },
              ]
            : undefined;

      const isCategories = !isEmpty(categories);
      const categoriesClause: PromptDescriptorWhereInput[] | undefined =
         isCategories
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

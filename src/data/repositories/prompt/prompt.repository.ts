import { isEmpty } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import {
   PromptDescriptorsPage,
   PromptDescriptorWithRelations,
} from "@/data/types/db/prompt";
import { DPromptDescriptorsPageQuery } from "@/data/types/domain/prompt";
import {
   PromptDescriptorCreateInput,
   PromptDescriptorUpdateInput,
   PromptDescriptorWhereInput,
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
      userId: string,
      query?: DPromptDescriptorsPageQuery
   ): Promise<PromptDescriptorsPage> {
      const { pagination } = query || {};
      const { pageNumber, pageSize } = pagination || DEFAULT_PAGINATION;

      const whereClause = this.resolveGetPromptDescriptorsWhereInput(
         userId,
         query
      );

      const [data, count] = await Promise.all([
         this.prisma.promptDescriptor.findMany({
            where: whereClause,
            skip: pageNumber * pageSize,
            take: pageSize,
            include: {
               categories: true,
            },
            orderBy: { updatedAt: "desc" },
         }),
         this.prisma.promptDescriptor.count({
            where: whereClause,
         }),
      ]);

      return {
         content: data as PromptDescriptorWithRelations[],
         numberOfElements: data.length,
         pageNumber: pageNumber,
         pageSize: pageSize,
         totalElements: count,
         totalPages: Math.ceil(count / pageSize),
      };
   }

   async pGetPromptDescriptor(
      query: GetPromptQuery
   ): Promise<PromptDescriptorWithRelations | null> {
      const { id } = query;
      return await this.prisma.promptDescriptor.findFirst({
         where: { id },
         include: {
            categories: true,
            versions: {
               orderBy: { version: "desc" },
            },
            followUpPrompts: {
               orderBy: { order: "asc" },
            },
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

   async pCreatePrompt(data: PromptDescriptorCreateInput) {
      return await this.prisma.promptDescriptor.create({
         data,
      });
   }

   async pUpdatePrompt(promptId: string, data: PromptDescriptorUpdateInput) {
      return await this.prisma.promptDescriptor.update({
         where: { id: promptId },
         data,
      });
   }

   async pToggleFavorite(promptId: string, isFavorite: boolean) {
      await this.prisma.promptDescriptor.update({
         where: { id: promptId },
         data: { isFavorite },
      });
   }

   async pDeletePrompt(promptId: string) {
      await this.prisma.promptDescriptor.delete({
         where: { id: promptId },
      });
   }

   private resolveGetPromptDescriptorsWhereInput(
      userId: string,
      query?: DPromptDescriptorsPageQuery
   ): PromptDescriptorWhereInput | undefined {
      const { globalFilter, filter } = query || {};
      const { categories, isFavorite } = filter || {};

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
                    content: {
                       contains: globalFilter,
                       mode: "insensitive",
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

      const favoriteClause =
         isFavorite !== undefined ? { isFavorite } : undefined;

      return {
         userId,
         OR: searchClause,
         AND: categoriesClause,
         ...favoriteClause,
      };
   }
}

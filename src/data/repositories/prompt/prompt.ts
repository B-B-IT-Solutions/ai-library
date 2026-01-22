import { isEmpty } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import {
   PromptDescriptorsPage,
   PromptDescriptorsPageQuery,
   PromptDescriptorWithRelations,
} from "@/data/types/db/prompt";
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
               versions: {
                  orderBy: { version: "desc" },
               },
               followUpPrompts: {
                  orderBy: { order: "asc" },
               },
            },
            orderBy: { updatedAt: "desc" },
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
         include: {
            categories: true,
            versions: true,
            followUpPrompts: true,
         },
      });
   }

   async pUpdatePrompt(
      promptId: string,
      data: PromptDescriptorUpdateInput,
      createVersion: boolean
   ) {
      // Get current prompt to create version
      const current = await this.prisma.promptDescriptor.findUnique({
         where: { id: promptId },
         include: { categories: true },
      });

      if (!current) {
         throw new Error("Prompt not found");
      }

      const newVersion = current.currentVersion + 1;

      return await this.prisma.$transaction(async (tx) => {
         if (createVersion) {
            await tx.promptVersion.create({
               data: {
                  promptId,
                  version: newVersion,
                  content: current.content,
                  title: current.title,
                  categories: current.categories.map((c) => c.name),
                  createdAt: current.updatedAt,
               },
            });
         }

         const updated = await tx.promptDescriptor.update({
            where: { id: promptId },
            data: {
               ...data,
               currentVersion: createVersion
                  ? newVersion
                  : current.currentVersion,
            },
         });

         return updated;
      });
   }

   async pDeletePrompt(promptId: string) {
      await this.prisma.promptDescriptor.delete({
         where: { id: promptId },
      });
   }

   async pToggleFavorite(promptId: string, isFavorite: boolean) {
      await this.prisma.promptDescriptor.update({
         where: { id: promptId },
         data: { isFavorite },
      });
   }

   private resolveGetPromptDescriptorsWhereInput(
      query?: PromptDescriptorsPageQuery
   ): PromptDescriptorWhereInput | undefined {
      if (isEmpty(query)) {
         return undefined;
      }

      const { globalFilter, filter } = query;
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
         OR: searchClause,
         AND: categoriesClause,
         ...favoriteClause,
      };
   }
}

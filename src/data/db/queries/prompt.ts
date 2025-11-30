import { PromptsPage, PromptsPageQuery } from "@/data/types/db/prompt";
import {
   PromptCreateInput,
   PromptUpdateInput,
   PromptWhereInput,
} from "@/generated/prisma/models";
import prisma from "../prisma";
import { DEFAULT_PAGINATION } from "../utils";

export const getPrompts = async (
   query?: PromptsPageQuery
): Promise<PromptsPage> => {
   const { pagination } = query || {};
   const { pageNumber, pageSize } = pagination || DEFAULT_PAGINATION;

   const whereClause: PromptWhereInput = {};

   const [data, count] = await prisma.$transaction([
      prisma.prompt.findMany({
         where: whereClause,
         skip: pageNumber * pageSize,
         take: pageSize,
         include: {
            categories: true,
         },
      }),
      prisma.prompt.count({
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
};

export const getPromptCategories = async () => {
   return await prisma.promptCategory.findMany({
      select: {
         name: true,
      },
   });
};

export const createPrompt = async (product: PromptCreateInput) => {
   return await prisma.prompt.create({
      data: product,
   });
};

export const updatePrompt = async (
   promptId: string,
   data: PromptUpdateInput
) => {
   return await prisma.prompt.update({
      where: { id: promptId },
      data: data,
   });
};

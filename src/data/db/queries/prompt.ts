import { PromptsPage, PromptsPageQuery } from "@/data/types/db/prompt";
import { Prisma } from "@/generated/prisma/client";
import { PromptWhereInput } from "@/generated/prisma/models";
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
      }),
      prisma.prompt.count({
         where: whereClause,
      }),
   ]);

   return {
      content: data,
      pageNumber: pageNumber,
      pageSize: pageSize,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
   };
};

export const createPrompt = async (product: Prisma.PromptCreateInput) => {
   return await prisma.prompt.create({
      data: product,
   });
};

export const updatePrompt = async (
   promptId: string,
   data: Prisma.PromptUpdateInput
) => {
   return await prisma.prompt.update({
      where: { id: promptId },
      data: data,
   });
};

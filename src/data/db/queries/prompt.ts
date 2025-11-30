import { PromptsPage, PromptsPageQuery } from "@/data/types/db/prompt";
import { Prisma } from "@/generated/prisma/client";
import prisma from "../prisma";

export const getPrompts = async (
   query?: PromptsPageQuery
): Promise<PromptsPage> => {
   const { pagination } = query || {};
   const { pageNumber = 1, pageSize = 10 } = pagination || {};

   const data = await prisma.prompt.findMany({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
   });

   return {
      content: data,
      pageNumber: pageNumber,
      pageSize: pageSize,
      totalElements: 50,
      totalPages: 100,
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

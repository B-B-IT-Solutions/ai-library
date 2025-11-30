import { isEmpty } from "es-toolkit/compat";

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

   const whereClause = resolveGetPromptsWhereInput(query);

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

const resolveGetPromptsWhereInput = (
   query?: PromptsPageQuery
): PromptWhereInput | undefined => {
   if (isEmpty(query)) {
      return undefined;
   }

   const { globalFilter } = query;
   const { categories } = query.filter || {};

   const searchClause: PromptWhereInput[] | undefined = globalFilter
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
   const categoriesClause: PromptWhereInput[] | undefined = isCategories
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
};

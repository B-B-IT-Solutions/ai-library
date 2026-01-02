import { isEmpty } from "es-toolkit/compat";

import prisma from "@/data/repositories/prisma";
import {
   PromptsPage,
   PromptsPageQuery,
   PromptWithCategories,
} from "@/data/types/db/prompt";
import { Prisma } from "@/generated/prisma/client";
import {
   PromptCreateInput,
   PromptUpdateInput,
} from "@/generated/prisma/models";
import { DEFAULT_PAGINATION } from "../utils";

export const getPrompts = async (
   query?: PromptsPageQuery
): Promise<PromptsPage> => {
   const { pagination } = query || {};
   const { pageNumber, pageSize } = pagination || DEFAULT_PAGINATION;

   const whereClause = resolveGetPromptsWhereInput(query);

   const [data, count] = await prisma.$transaction([
      prisma.promptDescriptor.findMany({
         where: whereClause,
         skip: pageNumber * pageSize,
         take: pageSize,
         include: {
            categories: true,
         },
      }),
      prisma.promptDescriptor.count({
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

export type GetPromptQuery = {
   id: string;
};

export const getPrompt = async (
   query: GetPromptQuery
): Promise<PromptWithCategories | null> => {
   const { id } = query;
   const descriptor = await prisma.promptDescriptor.findFirst({
      where: { id },
      include: {
         categories: true,
         prompt: true,
      },
   });

   if (!descriptor) {
      return null;
   }

   return {
      ...descriptor,
      content: descriptor.prompt?.content || "",
      followUpPrompts: descriptor.prompt?.followUpPrompts || [],
   };
};

export const getPromptCategories = async () => {
   return await prisma.promptCategory.findMany({
      select: {
         name: true,
      },
   });
};

export const createPrompt = async (data: PromptCreateInput) => {
   const { content, followUpPrompts, ...descriptorData } = data;

   return await prisma.promptDescriptor.create({
      data: {
         ...descriptorData,
         prompt: {
            create: {
               content,
               followUpPrompts,
            },
         },
      },
      include: {
         categories: true,
         prompt: true,
      },
   });
};

export const updatePrompt = async (
   promptId: string,
   data: PromptUpdateInput
) => {
   const { content, followUpPrompts, ...descriptorData } = data;

   return await prisma.promptDescriptor.update({
      where: { id: promptId },
      data: {
         ...descriptorData,
         prompt: {
            update: {
               content,
               followUpPrompts,
            },
         },
      },
      include: {
         categories: true,
         prompt: true,
      },
   });
};

const resolveGetPromptsWhereInput = (
   query?: PromptsPageQuery
): Prisma.PromptDescriptorWhereInput | undefined => {
   if (isEmpty(query)) {
      return undefined;
   }

   const { globalFilter } = query;
   const { categories } = query.filter || {};

   const searchClause: Prisma.PromptDescriptorWhereInput[] | undefined =
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
   const categoriesClause: Prisma.PromptDescriptorWhereInput[] | undefined =
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
};

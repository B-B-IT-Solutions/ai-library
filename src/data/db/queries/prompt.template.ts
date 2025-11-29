import { isEmpty } from "es-toolkit/compat";

import { Prisma } from "@/generated/prisma/client";
import prisma from "../prisma";

type PGetPromptTemplatesParams = {
   search?: string;
   categories?: string[];
};

export const getPromptTemplates = async (
   params?: PGetPromptTemplatesParams
) => {
   const where = resolveGetPromptTemplatesWhereInput(params);
   return await prisma.promptTemplate.findMany({
      where: where,
      include: {
         categories: true,
      },
      take: 20,
   });
};

export const getPromptTemplateCategories = async () => {
   return await prisma.promptTemplateCategory.findMany({
      select: {
         name: true,
      },
   });
};

const resolveGetPromptTemplatesWhereInput = (
   params?: PGetPromptTemplatesParams
): Prisma.PromptTemplateWhereInput | undefined => {
   if (isEmpty(params)) {
      return undefined;
   }

   const { search, categories } = params;

   const searchClause: Prisma.PromptTemplateWhereInput[] | undefined = search
      ? [
           {
              title: {
                 contains: search,
                 mode: "insensitive",
              },
           },
           {
              content: {
                 contains: search,
                 mode: "insensitive",
              },
           },
        ]
      : undefined;

   const categoriesClause: Prisma.PromptTemplateWhereInput[] | undefined =
      categories
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

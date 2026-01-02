import { isEmpty } from "es-toolkit/compat";

import prisma from "@/data/repositories/prisma";
import { Prisma } from "@/generated/prisma/client";

type PGetPromptTemplateDescriptorsParams = {
   search?: string;
   categories?: string[];
};

export const getPromptTemplateDescriptors = async (
   params?: PGetPromptTemplateDescriptorsParams
) => {
   const where = resolveGetPromptTemplateDescriptorssWhereInput(params);
   return await prisma.promptTemplateDescriptor.findMany({
      where: where,
      include: {
         categories: true,
      },
      take: 20,
   });
};

export const getPromptTemplate = async (id: string) => {
   const descriptor = await prisma.promptTemplateDescriptor.findUnique({
      where: { id },
      include: {
         categories: true,
         promptTemplate: true,
      },
   });

   if (!descriptor) {
      return null;
   }

   return {
      ...descriptor,
      content: descriptor.promptTemplate?.content || "",
   };
};

export const getPromptTemplateCategories = async () => {
   return await prisma.promptTemplateCategory.findMany({
      select: {
         name: true,
      },
   });
};

const resolveGetPromptTemplateDescriptorssWhereInput = (
   params?: PGetPromptTemplateDescriptorsParams
): Prisma.PromptTemplateDescriptorWhereInput | undefined => {
   if (isEmpty(params)) {
      return undefined;
   }

   const { search, categories } = params;

   const searchClause: Prisma.PromptTemplateDescriptorWhereInput[] | undefined =
      search
         ? [
              {
                 title: {
                    contains: search,
                    mode: "insensitive",
                 },
              },
              {
                 promptTemplate: {
                    content: {
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
};

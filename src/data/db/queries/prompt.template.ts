import prisma from "../prisma";

export const getPromptTemplates = async () => {
   return await prisma.promptTemplate.findMany({
      include: {
         categories: {
            select: {
               name: true,
            },
         },
      },
   });
};

export const getPromptTemplateCategories = async () => {
   return await prisma.promptTemplateCategory.findMany({
      select: {
         name: true,
      },
   });
};

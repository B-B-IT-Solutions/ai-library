import prisma from "../prisma";

export const getPromptTemplates = async () => {
   return await prisma.promptTemplate.findMany();
};

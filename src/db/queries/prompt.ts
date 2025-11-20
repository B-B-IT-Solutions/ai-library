import prisma from "../prisma";

export const getPrompts = async () => {
   return await prisma.prompt.findMany();
};

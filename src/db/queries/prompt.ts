import { Prisma } from "@/generated/prisma/client";
import prisma from "../prisma";

export const getPrompts = async () => {
   return await prisma.prompt.findMany();
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

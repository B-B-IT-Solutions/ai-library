import { range } from "es-toolkit";
import { Prompt } from "@/generated/prisma/client";

export const dbPrompts = (count = 3): Prompt[] => {
   return range(0, count).map((i) => dbPrompt(i));
};

export const dbPrompt = (index = 1): Prompt => {
   return {
      id: `334db648-f300-4284-8149-075ff465d75${index}`,
      title: `title ${index}`,
      content: `content ${index}`,
      categories: [`category ${index}`],
      recommendedModel: `model ${index}`,
      isFavorite: true,
      updatedAt: new Date("2025-09-27"),
      createdAt: new Date("2025-09-27"),
   };
};

import { range } from "es-toolkit";

import { DPrompt, DPromptTemplate } from "@/data/domain/prompt";

export const dPromptTemplates = (count = 3): DPromptTemplate[] => {
   return range(0, count).map((i) => dPromptTemplate(i));
};

export const dPromptTemplate = (index = 1): DPromptTemplate => {
   return {
      id: `334db648-f300-4284-8149-075ff465d75${index}`,
      title: `title ${index}`,
      content: `content ${index}`,
      categories: [`category ${index}`],
      recommendedModel: `model ${index}`,
      followUpPrompts: [
         "follow up prompt 1",
         "follow up prompt 2",
         "follow up prompt 3",
      ],
      isFavorite: true,
      currentVersion: 1,
      versions: [],
      updatedAt: new Date("2025-09-27").toISOString(),
      createdAt: new Date("2025-09-27").toISOString(),
   };
};
export const dPrompts = (count = 3): DPrompt[] => {
   return range(0, count).map((i) => dPrompt(i));
};

export const dPrompt = (index = 1): DPrompt => {
   return {
      id: `334db648-f300-4284-8149-075ff465d75${index}`,
      title: `title ${index}`,
      content: `content ${index}`,
      categories: [`category ${index}`],
      recommendedModel: `model ${index}`,
      followUpPrompts: [
         "follow up prompt 1",
         "follow up prompt 2",
         "follow up prompt 3",
      ],
      isFavorite: true,
      currentVersion: 1,
      versions: [],
      updatedAt: new Date("2025-09-27").toISOString(),
      createdAt: new Date("2025-09-27").toISOString(),
   };
};

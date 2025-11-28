import { range } from "es-toolkit";

import {
   Prompt,
   PromptTemplate,
   PromptTemplateCategory,
} from "@/generated/prisma/client";
import {
   PromptCreateInput,
   PromptUpdateInput,
} from "@/generated/prisma/models";

export const pPromptTemplates = (count = 3): PromptTemplate[] => {
   return range(0, count).map((i) => pPromptTemplate(i));
};

export const pPromptTemplate = (index = 1): PromptTemplate => {
   return {
      id: `334db648-f300-4284-8149-075ff465d75${index}`,
      title: `title ${index}`,
      content: `content ${index}`,
      recommendedModel: `model ${index}`,
      updatedAt: new Date("2025-09-27"),
      createdAt: new Date("2025-09-27"),
   };
};

export const pPromptTemplateCategories = (
   count = 3
): PromptTemplateCategory[] => {
   return range(0, count).map((i) => pPromptTemplateCategory(i));
};

export const pPromptTemplateCategory = (index = 1): PromptTemplateCategory => {
   return {
      id: Math.random(),
      name: `category ${index}`,
   };
};

export const pPrompts = (count = 3): Prompt[] => {
   return range(0, count).map((i) => pPrompt(i));
};

export const pPrompt = (index = 1): Prompt => {
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
      updatedAt: new Date("2025-09-27"),
      createdAt: new Date("2025-09-27"),
   };
};

export const pPromptCreateInput = (index = 1): PromptCreateInput => {
   return {
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
      updatedAt: new Date("2025-09-27"),
      createdAt: new Date("2025-09-27"),
   };
};

export const pPromptUpdateInput = (index = 1): PromptUpdateInput => {
   return {
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
      currentVersion: 2,
      updatedAt: new Date("2025-09-27"),
      createdAt: new Date("2025-09-27"),
   };
};

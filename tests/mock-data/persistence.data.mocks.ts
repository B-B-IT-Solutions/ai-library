import { range } from "es-toolkit";

import { PromptsPage, PromptWithCategories } from "@/data/types/db/prompt";
import { PromptTemplateWithCategories } from "@/data/types/db/prompt.template";
import {
   Prompt,
   PromptCategory,
   PromptTemplate,
   PromptTemplateCategory,
} from "@/generated/prisma/client";
import {
   PromptCreateInput,
   PromptUpdateInput,
} from "@/generated/prisma/models";

export const pPromptTemplatesWithCategories = (
   count = 3
): PromptTemplateWithCategories[] => {
   return range(0, count).map((i) => pPromptTemplateWithCategories(i));
};

export const pPromptTemplateWithCategories = (
   index = 1
): PromptTemplateWithCategories => {
   const template = pPromptTemplate(index);
   const categories = pPromptTemplateCategories();
   return {
      ...template,
      categories,
   };
};

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

export const pPromptsPage = (): PromptsPage => {
   const prompts = pPromptsWithCategories();
   return {
      content: prompts,
      numberOfElements: prompts.length,
      pageNumber: 1,
      pageSize: 3,
      totalElements: 15,
      totalPages: 5,
   };
};

export const pPromptsWithCategories = (count = 3): PromptWithCategories[] => {
   return range(0, count).map((i) => pPromptWithCategories(i));
};

export const pPromptWithCategories = (index = 1): PromptWithCategories => {
   const template = pPrompt(index);
   const categories = pPromptCategories();
   return {
      ...template,
      categories,
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
      categories: {
         connectOrCreate: [
            {
               where: {
                  name: `category ${index}`,
               },
               create: {
                  name: `category ${index}`,
               },
            },
         ],
      },
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
      categories: {
         connectOrCreate: [
            {
               where: {
                  name: `category ${index}`,
               },
               create: {
                  name: `category ${index}`,
               },
            },
         ],
      },
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

export const pPromptCategories = (count = 3): PromptCategory[] => {
   return range(0, count).map((i) => pPromptCategory(i));
};

export const pPromptCategory = (index = 1): PromptCategory => {
   return {
      id: Math.random(),
      name: `category ${index}`,
   };
};

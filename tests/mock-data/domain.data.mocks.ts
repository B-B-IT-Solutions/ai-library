import { range } from "es-toolkit";

import { Sort } from "@/data/types/common";
import {
   DPrompt,
   DPromptCategory,
   DPromptCreate,
   DPromptsFilter,
   DPromptsPage,
   DPromptsPageQuery,
   DPromptVersion,
} from "@/data/types/domain/prompt";
import {
   DPromptTemplate,
   DPromptTemplateCategory,
} from "@/data/types/domain/prompt.template";
import { DUserUpdateData } from "@/data/types/domain/user";

export const dUserUpdateData = (index = 1): DUserUpdateData => {
   return {
      name: `User ${index}`,
   };
};

export const dPromptTemplates = (count = 3): DPromptTemplate[] => {
   return range(0, count).map((i) => dPromptTemplate(i));
};

export const dPromptTemplate = (index = 1): DPromptTemplate => {
   return {
      id: `334db648-f300-4284-8149-075ff465d75${index}`,
      title: `title ${index}`,
      content: `content ${index}`,
      categories: dPromptTemplateCategories(),
      recommendedModel: `model ${index}`,
      updatedAt: new Date("2025-09-27").toISOString(),
      createdAt: new Date("2025-09-27").toISOString(),
   };
};

export const dPromptTemplateCategories = (
   count = 3
): DPromptTemplateCategory[] => {
   return range(0, count).map((i) => dPromptTemplateCategory(i));
};

export const dPromptTemplateCategory = (index = 1): DPromptTemplateCategory => {
   return {
      name: `category ${index}`,
   };
};

export const dPromptsPage = (): DPromptsPage => {
   const prompts = dPrompts();
   return {
      content: prompts,
      numberOfElements: prompts.length,
      pageNumber: 1,
      pageSize: 3,
      totalElements: 15,
      totalPages: 5,
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
      categories: dPromptCategories(),
      recommendedModel: `model ${index}`,
      followUpPrompts: [
         "follow up prompt 1",
         "follow up prompt 2",
         "follow up prompt 3",
      ],
      isFavorite: true,
      currentVersion: 1,
      versions: dPromptVersions(),
      updatedAt: new Date("2025-09-27").toISOString(),
      createdAt: new Date("2025-09-27").toISOString(),
   };
};

export const dPromptCreate = (index = 1): DPromptCreate => {
   return {
      title: `title ${index}`,
      content: `content ${index}`,
      categories: ["category 1"],
      recommendedModel: `model ${index}`,
      followUpPrompts: [
         "follow up prompt 1",
         "follow up prompt 2",
         "follow up prompt 3",
      ],
   };
};

export const dPromptCategories = (count = 3): DPromptCategory[] => {
   return range(0, count).map((i) => dPromptTemplateCategory(i));
};

export const dPromptCategory = (index = 1): DPromptCategory => {
   return {
      name: `category ${index}`,
   };
};

export const dPromptVersions = (count = 3): DPromptVersion[] => {
   return range(0, count).map((i) => dPromptVersion(i));
};

export const dPromptVersion = (index = 1): DPromptVersion => {
   return {
      version: index,
      content: `content ${index}`,
      createdAt: new Date("2025-09-27").toISOString(),
   };
};

export const dPromptsPageQuery = (): DPromptsPageQuery => {
   return {
      pagination: {
         pageNumber: 15,
         pageSize: 5,
      },
      filter: dPromptsFilter(),
      globalFilter: "test 1",
   };
};

export const dPromptsFilter = (): DPromptsFilter => {
   return {
      categories: ["cat 1", "cat 2", "cat 3"],
   };
};

export const sort = (field = "field1", desc = false): Sort => {
   return { field, desc };
};

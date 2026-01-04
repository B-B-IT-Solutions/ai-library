import { map } from "es-toolkit/compat";

import {
   PromptDescriptorsPage,
   PromptDescriptorWithCategories,
} from "@/data/types/db/prompt";
import { PromptTemplateDescriptorWithCategories } from "@/data/types/db/prompt.template";
import {
   DPromptDescriptor,
   DPromptDescriptorsPage,
} from "@/data/types/domain/prompt";
import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";

export const toDPromptTemplateDescriptors = (
   pPrompts: PromptTemplateDescriptorWithCategories[]
): DPromptTemplateDescriptor[] => {
   return map(pPrompts, (dbP) => toDPromptTemplateDescriptor(dbP));
};

export const toDPromptTemplateDescriptor = (
   prompt: PromptTemplateDescriptorWithCategories
): DPromptTemplateDescriptor => {
   return {
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      categories: prompt.categories,
      recommendedModel: prompt.recommendedModel,
      updatedAt: prompt.updatedAt.toISOString(),
      createdAt: prompt.createdAt.toISOString(),
   };
};

export const toDPromptDescriptorsPage = (
   pPromptsPage: PromptDescriptorsPage
): DPromptDescriptorsPage => {
   return {
      ...pPromptsPage,
      content: toDPromptDescriptors(pPromptsPage.content),
   };
};

export const toDPromptDescriptors = (
   pPrompts: PromptDescriptorWithCategories[]
): DPromptDescriptor[] => {
   return map(pPrompts, (dbP) => toDPromptDescriptor(dbP));
};

export const toDPromptDescriptor = (
   prompt: PromptDescriptorWithCategories
): DPromptDescriptor => {
   return {
      id: prompt.id,
      title: prompt.title,
      categories: prompt.categories,
      recommendedModel: prompt.recommendedModel,
      isFavorite: prompt.isFavorite,
      updatedAt: prompt.updatedAt.toISOString(),
      createdAt: prompt.createdAt.toISOString(),
   };
};

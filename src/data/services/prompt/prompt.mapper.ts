import { map } from "es-toolkit/compat";

import {
   PromptDescriptorsPage,
   PromptDescriptorWithCategories,
} from "@/data/types/db/prompt";
import {
   DPromptDescriptor,
   DPromptDescriptorsPage,
} from "@/data/types/domain/prompt";

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

import { map } from "es-toolkit/compat";

import {
   PromptDescriptorsPage,
   PromptDescriptorWithRelations,
} from "@/data/types/db/prompt";
import {
   DPromptDescriptor,
   DPromptDescriptorsPage,
   DPromptFollowUp,
   DPromptVersion,
} from "@/data/types/domain/prompt";
import { PromptFollowUp, PromptVersion } from "@/generated/prisma/client";

export const toDPromptDescriptorsPage = (
   pPromptsPage: PromptDescriptorsPage
): DPromptDescriptorsPage => {
   return {
      ...pPromptsPage,
      content: toDPromptDescriptors(pPromptsPage.content),
   };
};

export const toDPromptDescriptors = (
   pPrompts: PromptDescriptorWithRelations[]
): DPromptDescriptor[] => {
   return map(pPrompts, (dbP) => toDPromptDescriptor(dbP));
};

export const toDPromptDescriptor = (
   prompt: PromptDescriptorWithRelations
): DPromptDescriptor => {
   return {
      id: prompt.id,
      title: prompt.title,
      content: prompt.content,
      categories: prompt.categories,
      recommendedModel: prompt.recommendedModel,
      isFavorite: prompt.isFavorite,
      currentVersion: prompt.currentVersion,
      versions: map(prompt.versions, toDPromptVersion),
      followUpPrompts: map(prompt.followUpPrompts, toDPromptFollowUp),
      updatedAt: prompt.updatedAt.toISOString(),
      createdAt: prompt.createdAt.toISOString(),
   };
};

const toDPromptVersion = (version: PromptVersion): DPromptVersion => {
   return {
      id: version.id,
      version: version.version,
      content: version.content,
      createdAt: version.createdAt.toISOString(),
   };
};

const toDPromptFollowUp = (followUp: PromptFollowUp): DPromptFollowUp => {
   return {
      id: followUp.id,
      content: followUp.content,
      order: followUp.order,
   };
};

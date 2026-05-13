import { map } from "es-toolkit/compat";

import { Prompt0sPage, Prompt0WithRelations } from "@/data/types/db/prompt";
import {
   DPrompt0,
   DPrompt0FollowUp,
   DPrompt0sPage,
   DPrompt0Version,
} from "@/data/types/domain/prompt";
import { Prompt0FollowUp, Prompt0Version } from "@/generated/prisma/client";

export const toDPromptDescriptorsPage = (
   pPromptsPage: Prompt0sPage
): DPrompt0sPage => {
   return {
      ...pPromptsPage,
      content: toDPromptDescriptors(pPromptsPage.content),
   };
};

export const toDPromptDescriptors = (
   pPrompts: Prompt0WithRelations[]
): DPrompt0[] => {
   return map(pPrompts, (dbP) => toDPromptDescriptor(dbP));
};

export const toDPromptDescriptor = (prompt: Prompt0WithRelations): DPrompt0 => {
   return {
      id: prompt.id,
      title: prompt.title,
      content: prompt.content,
      categories: prompt.categories,
      recommendedModel: prompt.recommendedModel,
      isFavorite: prompt.isFavorite,
      currentVersion: prompt.currentVersion,
      followUpPrompts: toDPrompt0FollowUps(prompt.followUpPrompts),
      versions: toDPromptVersions(prompt.versions),
      updatedAt: prompt.updatedAt.toISOString(),
      createdAt: prompt.createdAt.toISOString(),
   };
};

const toDPrompt0FollowUps = (
   pFollowUps: Prompt0FollowUp[]
): DPrompt0FollowUp[] => {
   return map(pFollowUps, (f) => toDPrompt0FollowUp(f));
};

const toDPrompt0FollowUp = (followUp: Prompt0FollowUp): DPrompt0FollowUp => {
   return {
      id: followUp.id,
      content: followUp.content,
      order: followUp.order,
   };
};

const toDPromptVersions = (pVersions: Prompt0Version[]): DPrompt0Version[] => {
   return map(pVersions, (v) => toDPromptVersion(v));
};

const toDPromptVersion = (version: Prompt0Version): DPrompt0Version => {
   return {
      id: version.id,
      version: version.version,
      content: version.content,
      createdAt: version.createdAt.toISOString(),
   };
};

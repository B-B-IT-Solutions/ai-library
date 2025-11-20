import { DPrompt } from "@/data/domain/prompt";
import { Prompt } from "@/generated/prisma/browser";
import { map } from "es-toolkit/compat";

export const toDPrompts = (pPrompts: Prompt[]): DPrompt[] => {
   return map(pPrompts, (dbP) => toDPrompt(dbP));
};

export const toDPrompt = (prompt: Prompt): DPrompt => {
   return {
      title: prompt.title,
      content: prompt.content,
      categories: prompt.categories,
      recommendedModel: prompt.recommendedModel,
   };
};

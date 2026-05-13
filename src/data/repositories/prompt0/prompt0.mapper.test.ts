import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";

import { Prompt0sPage, Prompt0WithRelations } from "@/data/types/db/prompt0";
import {
   DPrompt0,
   DPrompt0FollowUp,
   DPrompt0sPage,
   DPrompt0Version,
} from "@/data/types/domain/prompt0";
import { Prompt0FollowUp, Prompt0Version } from "@/generated/prisma/client";

import {
   toDPromptDescriptor,
   toDPromptDescriptors,
   toDPromptDescriptorsPage,
} from "./prompt0.mapper";

const toDPromptDescriptorsPageInternal = (
   pPromptsPage: Prompt0sPage
): DPrompt0sPage => {
   return {
      ...pPromptsPage,
      content: toDPromptDescriptorsInternal(pPromptsPage.content),
   };
};

const toDPromptDescriptorsInternal = (
   pPrompts: Prompt0WithRelations[]
): DPrompt0[] => {
   return map(pPrompts, (dbP) => toDPromptDescriptor(dbP));
};

const toDPromptVersionInternal = (version: Prompt0Version): DPrompt0Version => {
   return {
      id: version.id,
      version: version.version,
      content: version.content,
      createdAt: version.createdAt.toISOString(),
   };
};

const toDPrompt0FollowUpInternal = (
   followUp: Prompt0FollowUp
): DPrompt0FollowUp => {
   return {
      id: followUp.id,
      content: followUp.content,
      order: followUp.order,
   };
};

const toDPromptDescriptorInternal = (
   prompt: Prompt0WithRelations
): DPrompt0 => {
   return {
      id: prompt.id,
      title: prompt.title,
      content: prompt.content,
      categories: prompt.categories,
      recommendedModel: prompt.recommendedModel,
      isFavorite: prompt.isFavorite,
      currentVersion: prompt.currentVersion,
      versions: map(prompt.versions, toDPromptVersionInternal),
      followUpPrompts: map(prompt.followUpPrompts, toDPrompt0FollowUpInternal),
      updatedAt: prompt.updatedAt.toISOString(),
      createdAt: prompt.createdAt.toISOString(),
   };
};

describe("toDPromptDescriptors tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("toDPromptDescriptorsPage test", async () => {
      const page = ptestData.pPromptDescriptorsPage();
      const result = toDPromptDescriptorsPage(page);
      const expectedResult = toDPromptDescriptorsPageInternal(page);
      expect(result).toEqual(expectedResult);
   });

   it("toDPromptDescriptors test", async () => {
      const prompts = ptestData.pPromptDescriptorsWithRelations();
      const result = toDPromptDescriptors(prompts);
      const expectedResult = toDPromptDescriptorsInternal(prompts);
      expect(result).toEqual(expectedResult);
   });

   it("toDPromptDescriptor test", async () => {
      const prompt = ptestData.pPromptDescriptorWithRelations();
      const result = toDPromptDescriptor(prompt);
      const expectedResult = toDPromptDescriptorInternal(prompt);
      expect(result).toEqual(expectedResult);
   });
});

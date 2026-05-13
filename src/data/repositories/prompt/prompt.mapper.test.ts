import { ptestData } from "@tests";
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
import { Prompt0FollowUp, Prompt0Version } from "@/generated/prisma/client";

import {
   toDPromptDescriptor,
   toDPromptDescriptors,
   toDPromptDescriptorsPage,
} from "./prompt.mapper";

const toDPromptDescriptorsPageInternal = (
   pPromptsPage: PromptDescriptorsPage
): DPromptDescriptorsPage => {
   return {
      ...pPromptsPage,
      content: toDPromptDescriptorsInternal(pPromptsPage.content),
   };
};

const toDPromptDescriptorsInternal = (
   pPrompts: PromptDescriptorWithRelations[]
): DPromptDescriptor[] => {
   return map(pPrompts, (dbP) => toDPromptDescriptor(dbP));
};

const toDPromptVersionInternal = (version: Prompt0Version): DPromptVersion => {
   return {
      id: version.id,
      version: version.version,
      content: version.content,
      createdAt: version.createdAt.toISOString(),
   };
};

const toDPrompt0FollowUpInternal = (
   followUp: Prompt0FollowUp
): DPromptFollowUp => {
   return {
      id: followUp.id,
      content: followUp.content,
      order: followUp.order,
   };
};

const toDPromptDescriptorInternal = (
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

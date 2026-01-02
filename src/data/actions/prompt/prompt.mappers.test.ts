import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";

import {
   PromptDescriptorsPage,
   PromptDescriptorWithCategories,
} from "@/data/types/db/prompt";
import { DPrompt, DPromptDescriptorsPage } from "@/data/types/domain/prompt";

import { toDPrompt, toDPrompts, toDPromptsPage } from "./prompt.mapper";

const toDPromptsPageInternal = (
   pPromptsPage: PromptDescriptorsPage
): DPromptDescriptorsPage => {
   return {
      ...pPromptsPage,
      content: toDPromptsInternal(pPromptsPage.content),
   };
};

const toDPromptsInternal = (
   pPrompts: PromptDescriptorWithCategories[]
): DPrompt[] => {
   return map(pPrompts, (dbP) => toDPrompt(dbP));
};

const toDPromptInternal = (prompt: PromptDescriptorWithCategories): DPrompt => {
   return {
      id: prompt.id,
      title: prompt.title,
      content: prompt.content,
      categories: prompt.categories,
      recommendedModel: prompt.recommendedModel,
      followUpPrompts: prompt.followUpPrompts,
      currentVersion: prompt.currentVersion,
      isFavorite: prompt.isFavorite,
      versions: [],
      updatedAt: prompt.updatedAt.toISOString(),
      createdAt: prompt.createdAt.toISOString(),
   };
};

describe("toDPrompt tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("toDPromptsPage test", async () => {
      const page = ptestData.pPromptDescriptorsPage();
      const result = toDPromptsPage(page);
      const expectedResult = toDPromptsPageInternal(page);
      expect(result).toEqual(expectedResult);
   });

   it("toDPrompts test", async () => {
      const prompts = ptestData.pPromptDescriptorssWithCategories();
      const result = toDPrompts(prompts);
      const expectedResult = toDPromptsInternal(prompts);
      expect(result).toEqual(expectedResult);
   });

   it("toDPrompt test", async () => {
      const prompt = ptestData.pPromptDescriptorWithCategories();
      const result = toDPrompt(prompt);
      const expectedResult = toDPromptInternal(prompt);
      expect(result).toEqual(expectedResult);
   });
});

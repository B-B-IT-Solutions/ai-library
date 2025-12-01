import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";

import { PromptsPage, PromptWithCategories } from "@/data/types/db/prompt";
import { DPrompt, DPromptsPage } from "@/data/types/domain/prompt";

import { toDPrompt, toDPrompts, toDPromptsPage } from "./prompt.mapper";

const toDPromptsPageInternal = (pPromptsPage: PromptsPage): DPromptsPage => {
   return {
      ...pPromptsPage,
      content: toDPromptsInternal(pPromptsPage.content),
   };
};

const toDPromptsInternal = (pPrompts: PromptWithCategories[]): DPrompt[] => {
   return map(pPrompts, (dbP) => toDPrompt(dbP));
};

const toDPromptInternal = (prompt: PromptWithCategories): DPrompt => {
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
      const page = ptestData.pPromptsPage();
      const result = toDPromptsPage(page);
      const expectedResult = toDPromptsPageInternal(page);
      expect(result).toEqual(expectedResult);
   });

   it("toDPrompts test", async () => {
      const prompts = ptestData.pPromptsWithCategories();
      const result = toDPrompts(prompts);
      const expectedResult = toDPromptsInternal(prompts);
      expect(result).toEqual(expectedResult);
   });

   it("toDPrompt test", async () => {
      const prompt = ptestData.pPromptWithCategories();
      const result = toDPrompt(prompt);
      const expectedResult = toDPromptInternal(prompt);
      expect(result).toEqual(expectedResult);
   });
});

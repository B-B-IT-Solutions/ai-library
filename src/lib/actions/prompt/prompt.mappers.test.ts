import { ptestData } from "@tests";
import { toDPrompt, toDPrompts } from "./prompt.mapper";
import { Prompt } from "@/generated/prisma/browser";
import { DPrompt } from "@/data/domain/prompt";
import { map } from "es-toolkit/compat";

const toDPromptsInternal = (pPrompts: Prompt[]): DPrompt[] => {
   return map(pPrompts, (dbP) => toDPrompt(dbP));
};

const toDPromptInternal = (prompt: Prompt): DPrompt => {
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

   it("toDPrompts test", async () => {
      const prompts = ptestData.pPrompts();
      const result = toDPrompts(prompts);
      const expectedResult = toDPromptsInternal(prompts);
      expect(result).toEqual(expectedResult);
   });

   it("toDPrompt test", async () => {
      const prompt = ptestData.pPrompt();
      const result = toDPrompt(prompt);
      const expectedResult = toDPromptInternal(prompt);
      expect(result).toEqual(expectedResult);
   });
});

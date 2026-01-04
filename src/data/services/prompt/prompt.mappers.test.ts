import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";

import {
   PromptDescriptorsPage,
   PromptDescriptorWithCategories,
} from "@/data/types/db/prompt";
import {
   DPromptDescriptor,
   DPromptDescriptorsPage,
} from "@/data/types/domain/prompt";

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
   pPrompts: PromptDescriptorWithCategories[]
): DPromptDescriptor[] => {
   return map(pPrompts, (dbP) => toDPromptDescriptor(dbP));
};

const toDPromptDescriptorInternal = (
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
      const prompts = ptestData.pPromptDescriptorssWithCategories();
      const result = toDPromptDescriptors(prompts);
      const expectedResult = toDPromptDescriptorsInternal(prompts);
      expect(result).toEqual(expectedResult);
   });

   it("toDPromptDescriptor test", async () => {
      const prompt = ptestData.pPromptDescriptorWithCategories();
      const result = toDPromptDescriptor(prompt);
      const expectedResult = toDPromptDescriptorInternal(prompt);
      expect(result).toEqual(expectedResult);
   });
});

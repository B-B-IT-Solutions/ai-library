import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";

import {
   PromptTemplateDescriptorWithCategories,
   PromptTemplateDescriptorWithPrompt,
} from "@/data/types/db/prompt.template";
import {
   DPromptTemplate,
   DPromptTemplateDescriptor,
   DPromptTemplateDescriptorWithPrompt,
} from "@/data/types/domain/prompt.template";
import { PromptTemplate } from "@/generated/prisma/client";

import {
   toDPromptTemplate,
   toDPromptTemplateDescriptor,
   toDPromptTemplateDescriptors,
   toDPromptTemplateDescriptorWithPrompt,
} from "./prompt.template.mapper";

const toDPromptTemplateDescriptorWithPromptInternal = (
   desciptor: PromptTemplateDescriptorWithPrompt
): DPromptTemplateDescriptorWithPrompt => {
   const dDescriptor = toDPromptTemplateDescriptor(desciptor);
   const promptTemplate = toDPromptTemplate(desciptor.promptTemplate);
   return {
      ...dDescriptor,
      promptTemplate,
   };
};

const toDPromptTemplateDescriptorsInternal = (
   pPrompts: PromptTemplateDescriptorWithCategories[]
): DPromptTemplateDescriptor[] => {
   return map(pPrompts, (dbP) => toDPromptTemplateDescriptorInternal(dbP));
};

const toDPromptTemplateDescriptorInternal = (
   prompt: PromptTemplateDescriptorWithCategories
): DPromptTemplateDescriptor => {
   return {
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      categories: prompt.categories,
      recommendedModel: prompt.recommendedModel,
      updatedAt: prompt.updatedAt.toISOString(),
      createdAt: prompt.createdAt.toISOString(),
   };
};

const toDPromptTemplateInternal = (prompt: PromptTemplate): DPromptTemplate => {
   return {
      id: prompt.id,
      promptText: prompt.promptText,
      detailedDescription: prompt.detailedDescription,
      updatedAt: prompt.updatedAt.toISOString(),
      createdAt: prompt.createdAt.toISOString(),
   };
};

describe("prompt.template mappers tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("toDPromptTemplateDescriptorWithPrompt test", async () => {
      const descriptor = ptestData.pPromptTemplateDescriptorWithPrompt();
      const result = toDPromptTemplateDescriptorWithPrompt(descriptor);
      const expectedResult =
         toDPromptTemplateDescriptorWithPromptInternal(descriptor);
      expect(result).toEqual(expectedResult);
   });

   it("toDPromptTemplateDescriptors test", async () => {
      const descriptors = ptestData.pPromptTemplateDescriptorsWithCategories();
      const result = toDPromptTemplateDescriptors(descriptors);
      const expectedResult = toDPromptTemplateDescriptorsInternal(descriptors);
      expect(result).toEqual(expectedResult);
   });

   it("toDPromptTemplateDescriptor test", async () => {
      const descriptor = ptestData.pPromptTemplateDescriptorWithCategories();
      const result = toDPromptTemplateDescriptor(descriptor);
      const expectedResult = toDPromptTemplateDescriptorInternal(descriptor);
      expect(result).toEqual(expectedResult);
   });

   it("toDPromptTemplate test", async () => {
      const prompt = ptestData.pPromptTemplate();
      const result = toDPromptTemplate(prompt);
      const expectedResult = toDPromptTemplateInternal(prompt);
      expect(result).toEqual(expectedResult);
   });
});

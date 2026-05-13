import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";

import {
   PromptContentWithFields,
   PromptWithCategories,
} from "@/data/types/db/prompt";
import { DPromptField, DPrompt, DPrompt } from "@/data/types/domain/prompt";
import { PromptField } from "@/generated/prisma/client";

import {
   toDPromptTemplate,
   toDTemplateDescriptor,
   toDTemplateDescriptors,
} from "./template.mapper";

const toDPromptTemplateDescriptorsInternal = (
   pPrompts: PromptWithCategories[]
): DPrompt[] => {
   return map(pPrompts, (dbP) => toDPromptTemplateDescriptorInternal(dbP));
};

const toDPromptTemplateDescriptorInternal = (
   prompt: PromptWithCategories
): DPrompt => {
   return {
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      categories: prompt.categories,
      recommendedModel: prompt.recommendedModel,
      isFavorite: prompt.isFavorite,
      updatedAt: prompt.updatedAt.toISOString(),
      createdAt: prompt.createdAt.toISOString(),
   };
};

const toDPromptTemplateInternal = (
   prompt: PromptContentWithFields
): DPrompt => {
   return {
      id: prompt.promptId,
      content: prompt.content,
      fields: toDTemplateFieldsInternal(prompt.fields),
      globalFieldIds: map(prompt.globalFields, (gf) => gf.globalFieldId),
      updatedAt: prompt.updatedAt.toISOString(),
      createdAt: prompt.createdAt.toISOString(),
   };
};

export const toDTemplateFieldsInternal = (
   fields: PromptField[]
): DPromptField[] => {
   return map(fields, toDTemplateFieldInternal).sort(
      (a, b) => a.order - b.order
   );
};

export const toDTemplateFieldInternal = (field: PromptField): DPromptField => ({
   id: field.id,
   promptId: field.promptId,
   name: field.name,
   label: field.label,
   description: field.description,
   type: field.type,
   required: field.required,
   order: field.order,
   defaultValue: field.defaultValue,
   options: field.options as string[] | undefined,
});

describe("prompt.template mappers tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("toDTemplateDescriptors test", async () => {
      const descriptors = ptestData.pPromptsWithCategories();
      const result = toDTemplateDescriptors(descriptors);
      const expectedResult = toDPromptTemplateDescriptorsInternal(descriptors);
      expect(result).toEqual(expectedResult);
   });

   it("toDTemplateDescriptor test", async () => {
      const descriptor = ptestData.pPromptWithCategories();
      const result = toDTemplateDescriptor(descriptor);
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

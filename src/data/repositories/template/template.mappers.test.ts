import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";

import {
   PromptTemplateDescriptorWithCategories,
   PromptTemplateWithFields,
} from "@/data/types/db/prompt.template";
import {
   DPromptTemplate,
   DPromptTemplateDescriptor,
   DPromptTemplateField,
} from "@/data/types/domain/prompt.template";
import { PromptTemplateField } from "@/generated/prisma/client";

import {
   toDPromptTemplate,
   toDTemplateDescriptor,
   toDTemplateDescriptors,
} from "./template.mapper";

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
      promptTemplateId: prompt.promptTemplateId,
      isFavorite: prompt.isFavorite,
      updatedAt: prompt.updatedAt.toISOString(),
      createdAt: prompt.createdAt.toISOString(),
   };
};

const toDPromptTemplateInternal = (
   prompt: PromptTemplateWithFields
): DPromptTemplate => {
   return {
      id: prompt.id,
      content: prompt.content,
      fields: toDTemplateFieldsInternal(prompt.fields),
      globalFieldIds: map(prompt.globalFields, (gf) => gf.globalFieldId),
      updatedAt: prompt.updatedAt.toISOString(),
      createdAt: prompt.createdAt.toISOString(),
   };
};

export const toDTemplateFieldsInternal = (
   fields: PromptTemplateField[]
): DPromptTemplateField[] => {
   return map(fields, toDTemplateFieldInternal).sort(
      (a, b) => a.order - b.order
   );
};

export const toDTemplateFieldInternal = (
   field: PromptTemplateField
): DPromptTemplateField => ({
   id: field.id,
   promptTemplateId: field.promptTemplateId,
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
      const descriptors = ptestData.pPromptTemplateDescriptorsWithCategories();
      const result = toDTemplateDescriptors(descriptors);
      const expectedResult = toDPromptTemplateDescriptorsInternal(descriptors);
      expect(result).toEqual(expectedResult);
   });

   it("toDTemplateDescriptor test", async () => {
      const descriptor = ptestData.pPromptTemplateDescriptorWithCategories();
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

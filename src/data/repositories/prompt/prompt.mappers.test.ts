import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";

import {
   PromptPreview,
   PromptWithCategories,
   PromptWithContent,
} from "@/data/types/db/prompt";
import {
   DPrompt,
   DPromptPreview,
   DPromptVariable,
   DPromptWithContent,
} from "@/data/types/domain/prompt";
import { PromptField } from "@/generated/prisma/client";

import {
   toDPrompt,
   toDPromptPreview,
   toDPromptPreviews,
   toDPrompts,
   toDPromptWithContent,
} from "./prompt.mapper";

export const toDPromptPreviewsInternal = (
   pPrompts: PromptPreview[]
): DPromptPreview[] => {
   return map(pPrompts, (dbP) => toDPromptPreviewInternal(dbP));
};

export const toDPromptPreviewInternal = (
   prompt: PromptPreview
): DPromptPreview => {
   return {
      id: prompt.id,
      title: prompt.title,
   };
};

const toDPromptsInternal = (pPrompts: PromptWithCategories[]): DPrompt[] => {
   return map(pPrompts, (dbP) => toDPromptInternal(dbP));
};

const toDPromptInternal = (prompt: PromptWithCategories): DPrompt => {
   return {
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      recommendedModel: prompt.recommendedModel,
      isFavorite: prompt.isFavorite,
      categories: prompt.categories,
      fields: [],
      globalFieldIds: [],
      updatedAt: prompt.updatedAt.toISOString(),
      createdAt: prompt.createdAt.toISOString(),
   };
};

const toDPromptWithContentInternal = (
   prompt: PromptWithContent
): DPromptWithContent => {
   return {
      ...toDPromptInternal(prompt),
      content: prompt.content.content,
      fields: toDPromptVariablesInternal(prompt.fields),
      globalFieldIds: map(prompt.globalFields, (gf) => gf.globalFieldId),
   };
};

export const toDPromptVariablesInternal = (
   fields: PromptField[]
): DPromptVariable[] => {
   return map(fields, toDPromptVariableInternal).sort(
      (a, b) => a.order - b.order
   );
};

export const toDPromptVariableInternal = (
   field: PromptField
): DPromptVariable => {
   return {
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
   };
};

describe("prompt mappers tests", () => {
   it("toDPromptPreviews test", async () => {
      const prompts = ptestData.pPromptPreviews();
      const result = toDPromptPreviews(prompts);
      const expectedResult = toDPromptPreviewsInternal(prompts);
      expect(result).toEqual(expectedResult);
   });

   it("toDPromptPreview test", async () => {
      const prompt = ptestData.pPromptPreview();
      const result = toDPromptPreview(prompt);
      const expectedResult = toDPromptPreviewInternal(prompt);
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

   it("toDPromptWithContent test", async () => {
      const prompt = ptestData.pPromptWithContent();
      const result = toDPromptWithContent(prompt);
      const expectedResult = toDPromptWithContentInternal(prompt);
      expect(result).toEqual(expectedResult);
   });
});

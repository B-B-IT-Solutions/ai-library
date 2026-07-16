import { dtestData } from "@tests";

import {
   DPromptCategoryUpdate,
   DPromptCategoryWithUsage,
} from "@/data/types/domain/prompt";

import { initPromptCategory } from "./init-values";

const expectedInitPromptCategoryExisting = (
   category: DPromptCategoryWithUsage
): DPromptCategoryUpdate => {
   return {
      name: category.name,
   };
};

const expectedInitPromptCategoryNew: DPromptCategoryUpdate = {
   name: "",
};

describe("initPromptCategory tests", () => {
   it("new category test", () => {
      const initValue = initPromptCategory();
      expect(initValue).toEqual(expectedInitPromptCategoryNew);
   });

   it("existing category test", () => {
      const category = dtestData.dPromptCategoryWithUsage();
      const initValues = initPromptCategory(category);
      const expectedValues = expectedInitPromptCategoryExisting(category);
      expect(initValues).toEqual(expectedValues);
   });
});

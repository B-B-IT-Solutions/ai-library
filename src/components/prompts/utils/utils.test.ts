import { dtestData } from "@tests";

import { isEditMode, navigateBackUrl } from "./utils";

describe("isEditMode - tests", () => {
   it("isEditMode false - test", () => {
      const result = isEditMode();
      expect(result).toBe(false);

      const prompt = dtestData.dPrompt();
      const result2 = isEditMode(prompt);
      expect(result2).toBe(true);
   });

   it("isEditMode true - test", () => {
      const prompt = dtestData.dPrompt();
      const result = isEditMode(prompt);
      expect(result).toBe(true);
   });
});

describe("navigateBackUrl - tests", () => {
   it("prompt undefined - collection undefined - test", () => {
      const result = navigateBackUrl();
      expect(result).toBe("/templates");
   });

   it("prompt undefined - collection defined - test", () => {
      const collection = dtestData.dCollection();
      const result = navigateBackUrl(undefined, collection);
      expect(result).toBe(`/collections/${collection.id}`);
   });

   it("prompt defined - collection undefined - test", () => {
      const prompt = dtestData.dPrompt();
      const result = navigateBackUrl(prompt);
      expect(result).toBe(`/templates/${prompt.id}`);
   });

   it("prompt defined - collection defined - test", () => {
      const prompt = dtestData.dPrompt();
      const collection = dtestData.dCollection();
      const result = navigateBackUrl(prompt, collection);
      expect(result).toBe(
         `/templates/${prompt.id}?collectionId=${collection.id}`
      );
   });
});

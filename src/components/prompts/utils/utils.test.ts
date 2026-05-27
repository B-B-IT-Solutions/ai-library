import { dtestData } from "@tests";

import {
   editPromptUrl,
   isEditMode,
   navigateBackPromptUrl,
   viewPromptUrl,
} from "./utils";

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

describe("viewPromptUrl - tests", () => {
   it("collectionId undefined - test", () => {
      const prompt = dtestData.dPrompt();
      const result = viewPromptUrl(prompt);
      expect(result).toBe(`/templates/${prompt.id}`);
   });

   it("collectionId defined - test", () => {
      const prompt = dtestData.dPrompt();
      const collection = dtestData.dCollection();
      const result = viewPromptUrl(prompt, collection.id);
      expect(result).toBe(
         `/templates/${prompt.id}?collectionId=${collection.id}`
      );
   });
});

describe("editPromptUrl - tests", () => {
   it("collection undefined - test", () => {
      const prompt = dtestData.dPrompt();
      const result = editPromptUrl(prompt);
      expect(result).toBe(`/templates/${prompt.id}/edit`);
   });

   it("collection defined - test", () => {
      const prompt = dtestData.dPrompt();
      const collection = dtestData.dCollection();
      const result = editPromptUrl(prompt, collection);
      expect(result).toBe(
         `/templates/${prompt.id}/edit?collectionId=${collection.id}`
      );
   });
});

describe("navigateBackPromptUrl - tests", () => {
   it("prompt undefined - collection undefined - test", () => {
      const result = navigateBackPromptUrl();
      expect(result).toBe("/templates");
   });

   it("prompt undefined - collection defined - test", () => {
      const collection = dtestData.dCollection();
      const result = navigateBackPromptUrl(undefined, collection);
      expect(result).toBe(`/collections/${collection.id}`);
   });

   it("prompt defined - collection undefined - test", () => {
      const prompt = dtestData.dPrompt();
      const result = navigateBackPromptUrl(prompt);
      expect(result).toBe(`/templates/${prompt.id}`);
   });

   it("prompt defined - collection defined - test", () => {
      const prompt = dtestData.dPrompt();
      const collection = dtestData.dCollection();
      const result = navigateBackPromptUrl(prompt, collection);
      expect(result).toBe(
         `/templates/${prompt.id}?collectionId=${collection.id}`
      );
   });
});

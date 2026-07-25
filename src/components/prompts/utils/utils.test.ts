import { dtestData } from "@tests";

import {
   breadcrumbRootUrl,
   editPromptUrl,
   isEditMode,
   newPromptUrl,
   promptEditNavigateBackUrl,
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
   it("collection undefined - test", () => {
      const prompt = dtestData.dPrompt();
      const result = viewPromptUrl(prompt);
      expect(result).toBe(`/prompts/${prompt.id}`);
   });

   it("collection defined - test", () => {
      const prompt = dtestData.dPrompt();
      const collection = dtestData.dCollectionPreview();
      const result = viewPromptUrl(prompt, collection);
      expect(result).toBe(
         `/prompts/${prompt.id}?collectionId=${collection.id}`
      );
   });
});

describe("editPromptUrl - tests", () => {
   it("collection undefined - test", () => {
      const prompt = dtestData.dPrompt();
      const result = editPromptUrl(prompt);
      expect(result).toBe(`/prompts/${prompt.id}/edit`);
   });

   it("collection defined - test", () => {
      const prompt = dtestData.dPrompt();
      const collection = dtestData.dCollectionPreview();
      const result = editPromptUrl(prompt, collection);
      expect(result).toBe(
         `/prompts/${prompt.id}/edit?collectionId=${collection.id}`
      );
   });
});

describe("newPromptUrl - tests", () => {
   it("collection undefined - test", () => {
      const result = newPromptUrl();
      expect(result).toBe("/prompts/new");
   });

   it("collection defined - test", () => {
      const collection = dtestData.dCollectionPreview();
      const result = newPromptUrl(collection);
      expect(result).toBe(`/prompts/new?collectionId=${collection.id}`);
   });
});

describe("promptEditNavigateBackUrl - tests", () => {
   it("prompt undefined - collection undefined - test", () => {
      const result = promptEditNavigateBackUrl();
      expect(result).toBe("/prompts");
   });

   it("prompt undefined - collection defined - test", () => {
      const collection = dtestData.dCollectionPreview();
      const result = promptEditNavigateBackUrl(undefined, collection);
      expect(result).toBe(`/collections/${collection.id}`);
   });

   it("prompt defined - collection undefined - test", () => {
      const prompt = dtestData.dPrompt();
      const result = promptEditNavigateBackUrl(prompt);
      expect(result).toBe(`/prompts/${prompt.id}`);
   });

   it("prompt defined - collection defined - test", () => {
      const prompt = dtestData.dPrompt();
      const collection = dtestData.dCollectionPreview();
      const result = promptEditNavigateBackUrl(prompt, collection);
      expect(result).toBe(
         `/prompts/${prompt.id}?collectionId=${collection.id}`
      );
   });
});

describe("breadcrumbRootUrl - tests", () => {
   it("collection undefined - test", () => {
      const result = breadcrumbRootUrl();
      expect(result).toBe("/prompts");
   });

   it("collection defined - test", () => {
      const collection = dtestData.dCollectionPreview();
      const result = breadcrumbRootUrl(collection);
      expect(result).toBe(`/collections/${collection.id}`);
   });
});

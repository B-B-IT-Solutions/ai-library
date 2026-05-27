import { dtestData } from "@tests";

import { isEdit, navigateBackUrl } from "./utils";

describe("isEdit - tests", () => {
   it("isEdit false - test", () => {
      const result = isEdit();
      expect(result).toBe(false);

      const prompt = dtestData.dPrompt();
      const result2 = isEdit(prompt);
      expect(result2).toBe(true);
   });

   it("isEdit true - test", () => {
      const prompt = dtestData.dPrompt();
      const result = isEdit(prompt);
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

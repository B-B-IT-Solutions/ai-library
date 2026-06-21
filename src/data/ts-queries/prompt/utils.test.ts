import { dtestData } from "@tests";

import { promptKeys, templateCategoriesKeys } from "./utils";

describe("keys tests", () => {
   test("promptKeys - test", async () => {
      const filters = dtestData.dPromptsFilter();
      const sort = dtestData.sort("name", "asc");
      const promptId = "prompt-id-1";

      expect(promptKeys.all).toEqual(["prompts"]);
      expect(promptKeys.prompts({})).toEqual(["prompts", {}]);
      expect(promptKeys.prompts({ filters, sort })).toEqual([
         "prompts",
         { filters, sort },
      ]);
      expect(promptKeys.publicPrompts({})).toEqual(["prompts", "public", {}]);
      expect(promptKeys.publicPrompts({ filters, sort })).toEqual([
         "prompts",
         "public",
         { filters, sort },
      ]);
      expect(promptKeys.promptPreviews({})).toEqual([
         "prompts",
         "previews",
         {},
      ]);
      expect(promptKeys.promptPreviews({ filters, sort })).toEqual([
         "prompts",
         "previews",
         { filters, sort },
      ]);
      expect(promptKeys.templatingData({ promptId })).toEqual([
         "prompts",
         "templatingData",
         promptId,
      ]);
   });

   test("templateCategoriesKeys test", async () => {
      expect(templateCategoriesKeys.all).toEqual([
         "prompt-template-categories",
      ]);
      expect(templateCategoriesKeys.categories()).toEqual([
         "prompt-template-categories",
      ]);
   });
});

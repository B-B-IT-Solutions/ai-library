import { dtestData } from "@tests";

import { promptKeys, templateCategoriesKeys } from "./utils";

describe("keys tests", () => {
   test("templateKeys - test", async () => {
      const filters = dtestData.dPromptsFilter();
      const sort = dtestData.sort("name", "asc");
      const promptId = "prompt-id-1";

      expect(promptKeys.all).toEqual(["templates"]);
      expect(promptKeys.prompts({})).toEqual(["templates", {}]);
      expect(promptKeys.prompts({ filters, sort })).toEqual([
         "templates",
         { filters, sort },
      ]);
      expect(promptKeys.publicPrompts({})).toEqual(["templates", "public", {}]);
      expect(promptKeys.publicPrompts({ filters, sort })).toEqual([
         "templates",
         "public",
         { filters, sort },
      ]);
      expect(promptKeys.promptPreviews({})).toEqual([
         "templates",
         "previews",
         {},
      ]);
      expect(promptKeys.promptPreviews({ filters, sort })).toEqual([
         "templates",
         "previews",
         { filters, sort },
      ]);
      expect(promptKeys.templatingData({ promptId })).toEqual([
         "templates",
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

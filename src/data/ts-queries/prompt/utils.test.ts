import { dtestData } from "@tests";

import { templateCategoriesKeys, templateKeys } from "./utils";

describe("keys tests", () => {
   test("templateKeys - test", async () => {
      const filters = dtestData.dPromptsFilter();
      const sort = dtestData.sort("name", "asc");

      expect(templateKeys.all).toEqual(["templates"]);
      expect(templateKeys.prompts({})).toEqual(["templates", {}]);
      expect(templateKeys.prompts({ filters, sort })).toEqual([
         "templates",
         { filters, sort },
      ]);
      expect(templateKeys.publicPrompts({})).toEqual([
         "templates",
         "public",
         {},
      ]);
      expect(templateKeys.publicPrompts({ filters, sort })).toEqual([
         "templates",
         "public",
         { filters, sort },
      ]);
      expect(templateKeys.promptPreviews({})).toEqual([
         "templates",
         "previews",
         {},
      ]);
      expect(templateKeys.promptPreviews({ filters, sort })).toEqual([
         "templates",
         "previews",
         { filters, sort },
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

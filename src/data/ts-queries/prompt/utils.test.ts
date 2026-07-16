import { dtestData } from "@tests";

import { promptKeys } from "./utils";

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
      expect(promptKeys.categories()).toEqual(["prompts", "categories", {}]);
      expect(promptKeys.categories("search-1")).toEqual([
         "prompts",
         "categories",
         { search: "search-1" },
      ]);
      expect(promptKeys.models()).toEqual(["prompts", "models", {}]);
      expect(promptKeys.models("search-1")).toEqual([
         "prompts",
         "models",
         { search: "search-1" },
      ]);
   });
});

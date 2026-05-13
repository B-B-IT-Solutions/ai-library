import { promptCategoriesKeys, promptKeys } from "./utils";

describe("promptKeys tests", () => {
   test("promptKeys - test", async () => {
      expect(promptKeys.all).toEqual(["prompts"]);
      expect(promptKeys.prompts()).toEqual(["prompts", {}]);
      expect(promptKeys.prompts({})).toEqual(["prompts", { params: {} }]);
      expect(promptKeys.prompts({ search: "test 1" })).toEqual([
         "prompts",
         { params: { search: "test 1" } },
      ]);
      expect(
         promptKeys.prompts({
            search: "test 123",
            categories: ["cat 1"],
         })
      ).toEqual([
         "prompts",
         { params: { search: "test 123", categories: ["cat 1"] } },
      ]);
   });
});

describe("promptCategoriesKeys tests", () => {
   test("promptCategoriesKeys - test", async () => {
      expect(promptCategoriesKeys.all).toEqual(["prompt-categories"]);
      expect(promptCategoriesKeys.categories()).toEqual(["prompt-categories"]);
   });
});

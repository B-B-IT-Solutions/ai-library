import { promptTemplateCategoryKeys, promptTemplateKeys } from "./utils";

describe("promptTemplateKeys tests", () => {
   test("promptTemplateKeys - test", async () => {
      expect(promptTemplateKeys.all).toEqual(["prompt-templates"]);
      expect(promptTemplateKeys.templates()).toEqual(["prompt-templates", {}]);
      expect(promptTemplateKeys.templates({})).toEqual([
         "prompt-templates",
         { params: {} },
      ]);
      expect(promptTemplateKeys.templates({ search: "test 1" })).toEqual([
         "prompt-templates",
         { params: { search: "test 1" } },
      ]);
      expect(
         promptTemplateKeys.templates({
            search: "test 123",
            categories: ["cat 1"],
         })
      ).toEqual([
         "prompt-templates",
         { params: { search: "test 123", categories: ["cat 1"] } },
      ]);
   });
});

describe("promptTemplateCategoryKeys tests", () => {
   test("promptTemplateCategoryKeys - test", async () => {
      expect(promptTemplateCategoryKeys.all).toEqual([
         "prompt-template-categories",
      ]);
      expect(promptTemplateCategoryKeys.categories()).toEqual([
         "prompt-template-categories",
      ]);
   });
});

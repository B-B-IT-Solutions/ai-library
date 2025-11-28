import { promptTemplateCategoryKeys, promptTemplateKeys } from "./utils";

describe("promptTemplateKeys tests", () => {
   test("promptTemplateKeys - test", async () => {
      expect(promptTemplateKeys.all).toEqual(["prompt-templates"]);
      expect(promptTemplateKeys.templates()).toEqual(["prompt-templates"]);
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

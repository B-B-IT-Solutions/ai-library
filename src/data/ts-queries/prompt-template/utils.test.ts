import { dtestData } from "@tests";

import { templateCategoriesKeys, templateKeys } from "./utils";

describe("keys tests", () => {
   test("templateKeys - test", async () => {
      const filters = dtestData.dTemplateDescriptorsFilter();
      const sort = dtestData.sort("name", "asc");

      expect(templateKeys.all).toEqual(["templates"]);
      expect(templateKeys.templates({})).toEqual(["templates", {}]);
      expect(templateKeys.templates({ filters, sort })).toEqual([
         "templates",
         { filters, sort },
      ]);
      expect(templateKeys.publicTemplates({})).toEqual([
         "templates",
         "public",
         {},
      ]);
      expect(templateKeys.publicTemplates({ filters, sort })).toEqual([
         "templates",
         "public",
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

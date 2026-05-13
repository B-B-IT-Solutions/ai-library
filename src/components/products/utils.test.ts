import { dtestData } from "@tests";

import { DPromptCategory } from "@/data/types/domain/prompt.template";

import { getTypeBadgeColor, resolveUniqCategories } from "./utils";

const expectedColors = {
   TEMPLATE: "bg-blue-100 text-blue-700 border-blue-200",
   BUNDLE: "bg-green-100 text-green-700 border-green-200",
};

describe("product utils tests", () => {
   it("getTypeBadgeColor - test", async () => {
      const color1 = getTypeBadgeColor("BUNDLE");
      expect(color1).toEqual(expectedColors.BUNDLE);

      const color2 = getTypeBadgeColor("TEMPLATE");
      expect(color2).toEqual(expectedColors.TEMPLATE);
   });

   it("resolveUniqCategories - test", async () => {
      const productItems = dtestData.dProductItems(3);
      productItems[0].template = null;

      const result1 = resolveUniqCategories([]);
      expect(result1).toEqual([]);

      const result2 = resolveUniqCategories(productItems);
      const expectedResult2: DPromptCategory[] = [
         { name: "category 0" },
         { name: "category 1" },
         { name: "category 2" },
      ];
      expect(result2).toEqual(expectedResult2);
   });
});

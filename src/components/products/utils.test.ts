import { getTypeBadgeColor } from "./utils";

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
});

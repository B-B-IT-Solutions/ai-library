import { borderCss } from "./utils";

const expectErrorBorder = "border-2 border-red-400 bg-red-50";
const expectIsUsedBorder = "border-green-200 bg-green-50";
const expectIsNotUsedBorder = "border-orange-200 bg-orange-50";
const expectNewVaribaleBorder = "border-slate-200 bg-slate-50";

describe("borderCss tests", () => {
   it("hasErrors true - test", () => {
      const result = borderCss(true, true, true);
      expect(result).toEqual(expectErrorBorder);
   });

   it("hasErrors false - hasName false - test", () => {
      const result = borderCss(false, false, false);
      expect(result).toEqual(expectNewVaribaleBorder);
   });

   it("hasErrors false - hasName true - isUsed true - test", () => {
      const result = borderCss(false, true, true);
      expect(result).toEqual(expectIsUsedBorder);
   });

   it("hasErrors false - hasName true - isUsed false - test", () => {
      const result = borderCss(false, true, false);
      expect(result).toEqual(expectIsNotUsedBorder);
   });
});

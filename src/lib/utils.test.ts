import { cn, toTestId } from "./utils";

describe("utils tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   test("toTestId test", async () => {
      expect(toTestId("")).toEqual("");
      expect(toTestId("Label1")).toEqual("label1");
      expect(toTestId("LABEL2")).toEqual("label2");
      expect(toTestId("LABEL 3")).toEqual("label-3");
      expect(toTestId("LABEL-4")).toEqual("label-4");
      expect(toTestId("LABEL -4")).toEqual("label-4");
      expect(toTestId("LABEL 1 / Label 5")).toEqual("label-1-label-5");
      expect(toTestId("LABEL 3 &/ Label 7")).toEqual("label-3-label-7");
      expect(toTestId("LABEL Of The Btn")).toEqual("label-of-the-btn");
      expect(toTestId(" Trimmed Text 123 ")).toEqual("trimmed-text-123");
   });

   it("cn test", async () => {
      const classes1 = "css-1 css-2 css-3";
      const classes2 = "css-4 css-5";
      const classes3 = "css-6";
      const result = cn(classes1, classes2, classes3);
      const expectedResult = `${classes1} ${classes2} ${classes3}`;

      expect(result).toEqual(expectedResult);
   });
});

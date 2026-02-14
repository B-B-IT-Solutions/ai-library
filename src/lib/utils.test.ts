import {
   cn,
   formatDateTime,
   navigateToExternalUrl,
   stringify,
   toTestId,
} from "./utils";

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

   it("stringify test", async () => {
      const value1 = { test: "test 1" };
      const result1 = stringify(value1);
      const expectedResult1 = JSON.stringify(value1);
      expect(result1).toEqual(expectedResult1);

      const value2 = "test 1";
      const result2 = stringify(value2);
      const expectedResult2 = JSON.stringify(value2);
      expect(result2).toEqual(expectedResult2);

      const result3 = stringify(null);
      expect(result3).toBeUndefined();
   });

   test("navigateToExternalUrl test", () => {
      const originalErrorLog = console.error;
      const errorFn = jest.fn();
      console.error = errorFn;

      const url = "https://test-url.com";
      navigateToExternalUrl(url);

      const expectedCause = "Not implemented: navigation (except hash changes)";
      expect(errorFn).toHaveBeenCalledTimes(1);
      const error = errorFn.mock.calls[0][0];
      expect(error.message).toEqual(expectedCause);

      console.error = originalErrorLog;
   });

   it("formatDateTime test", async () => {
      const ds = "2025-11-30T14:08:39.969Z";
      const result = formatDateTime(ds);

      const expectedResult = {
         dateTime: "30. Nov. 2025, 03:08 PM",
         dateOnly: "So., 30. Nov. 2025",
         timeOnly: "03:08 PM",
      };
      expect(result).toEqual(expectedResult);
   });
});

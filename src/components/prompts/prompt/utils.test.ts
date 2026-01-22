import { removeEmpty } from "./utils";

describe("utils tests", () => {
   it("removeEmpty test", async () => {
      const result1 = removeEmpty([]);
      expect(result1).toEqual([]);

      const result2 = removeEmpty(["test 1", ""]);
      expect(result2).toEqual(["test 1"]);

      const result3 = removeEmpty(["test 123", " ", ""]);
      expect(result3).toEqual(["test 123"]);
   });
});

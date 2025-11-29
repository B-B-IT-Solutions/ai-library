import { queryKey } from "./utils";

describe("queryKey tests", () => {
   test("queryKey - test", async () => {
      expect(queryKey()).toEqual({});
      expect(queryKey({})).toEqual({ params: {} });
      expect(queryKey({ search: "test 1" })).toEqual({
         params: { search: "test 1" },
      });
   });
});

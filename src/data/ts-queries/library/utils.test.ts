import { libraryKeys } from "./utils";

describe("libraryKeys tests", () => {
   test("libraryKeys - test", async () => {
      const promptId = "a9dec5e2-485b-467a-8c21-85c054b96745";

      expect(libraryKeys.all).toEqual(["library"]);
      expect(libraryKeys.entryCollections(promptId)).toEqual([
         "library",
         "entry",
         promptId,
         "collections",
      ]);
   });
});

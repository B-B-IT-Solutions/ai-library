import { libraryKeys } from "./utils";

describe("libraryKeys tests", () => {
   test("libraryKeys - test", async () => {
      const entryId = "a9dec5e2-485b-467a-8c21-85c054b96745";
      const collectionId = "d18d46a0-3d25-42aa-ac4a-15a37e406706";

      expect(libraryKeys.all).toEqual(["library"]);
      expect(libraryKeys.entryCollections(entryId)).toEqual([
         "library",
         "entry",
         entryId,
         "collections",
      ]);
      expect(libraryKeys.collections()).toEqual(["library", "collections"]);
      expect(libraryKeys.collection(collectionId)).toEqual([
         "library",
         "collection",
         collectionId,
      ]);
   });
});

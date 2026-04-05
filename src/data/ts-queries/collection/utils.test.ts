import { collectionKeys } from "./utils";

describe("collectionKeys tests", () => {
   test("collectionKeys - test", async () => {
      const collectionId = "a9dec5e2-485b-467a-8c21-85c054b96745";

      expect(collectionKeys.all).toEqual(["collections"]);
      expect(collectionKeys.collections()).toEqual(["collections"]);
      expect(collectionKeys.collection(collectionId)).toEqual([
         "collections",
         "collection",
         collectionId,
      ]);
      expect(collectionKeys.collectionTemplateIds(collectionId)).toEqual([
         "collections",
         "collection",
         collectionId,
         "templateIds",
      ]);
   });
});

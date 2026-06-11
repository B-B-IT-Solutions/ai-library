import { dtestData } from "@tests";

import { LoadCollectionsPageParams } from "./types";
import { collectionKeys } from "./utils";

describe("collectionKeys tests", () => {
   test("collectionKeys - test", async () => {
      const collectionId = "a9dec5e2-485b-467a-8c21-85c054b96745";
      const filters = dtestData.dCollectionsFilter();
      const sort = dtestData.sort("name", "asc");

      const params: LoadCollectionsPageParams = {
         filters: filters,
         sort: sort,
      };

      expect(collectionKeys.all).toEqual(["collections"]);
      expect(collectionKeys.collectionsPage({})).toEqual(["collections", {}]);
      expect(collectionKeys.collectionsPage(params)).toEqual([
         "collections",
         params,
      ]);
      expect(collectionKeys.collectionPreviews()).toEqual([
         "collections",
         "previews",
      ]);
      expect(collectionKeys.collection(collectionId)).toEqual([
         "collections",
         "collection",
         collectionId,
      ]);
      expect(collectionKeys.collectionPromptIds(collectionId)).toEqual([
         "collections",
         "collection",
         collectionId,
         "promptIds",
      ]);
   });
});

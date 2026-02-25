import { dtestData } from "@tests";

import { libraryKeys } from "./utils";

describe("libraryKeys tests", () => {
   test("libraryKeys - test", async () => {
      const filters = dtestData.dLibraryEntriesFilter();
      const entryId = "a9dec5e2-485b-467a-8c21-85c054b96745";

      expect(libraryKeys.all).toEqual(["library"]);
      expect(libraryKeys.entries()).toEqual(["library", "entries"]);
      expect(libraryKeys.entries(filters)).toEqual([
         "library",
         "entries",
         filters,
      ]);
      expect(libraryKeys.entryCollections(entryId)).toEqual([
         "library",
         "entry",
         entryId,
         "collections",
      ]);
      expect(libraryKeys.collections()).toEqual(["library", "collections"]);
   });
});

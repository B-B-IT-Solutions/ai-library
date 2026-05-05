import { dtestData } from "@tests";

import { catalogEntryCategoriesKeys, catalogEntryKeys } from "./utils";

describe("keys tests", () => {
   test("catalogEntryKeys - test", async () => {
      const filters = dtestData.dCatalogEntriesFilter();
      const sort = dtestData.sort("name", "asc");

      expect(catalogEntryKeys.all).toEqual(["catalog-entries"]);
      expect(catalogEntryKeys.entries({})).toEqual(["catalog-entries", {}]);
      expect(catalogEntryKeys.entries({ filters, sort })).toEqual([
         "catalog-entries",
         { filters, sort },
      ]);
   });

   test("catalogEntryCategoriesKeys test", async () => {
      expect(catalogEntryCategoriesKeys.all).toEqual([
         "catalog-entry-categories",
      ]);
      expect(catalogEntryCategoriesKeys.categories()).toEqual([
         "catalog-entry-categories",
      ]);
   });
});

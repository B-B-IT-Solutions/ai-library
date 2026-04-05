import { dtestData } from "@tests";

import { DCollection, DCollectionUpdate } from "@/data/types/domain/collection";

import { initCollection } from "./initValues";

const initCollectionInternal = (
   collection?: DCollection
): DCollectionUpdate => {
   return {
      name: collection?.name ?? "",
      description: collection?.description ?? "",
      color: collection?.color ?? "#3b82f6",     order: collection?.order ?? 0,
   };
};

describe("initCollection tests", () => {
   it("new collection test", () => {
      const result = initCollection();
      const expectedResult = initCollectionInternal();
      expect(result).toEqual(expectedResult);
   });

   it("existing collection test", () => {
      const collection = dtestData.dCollection();
      const result = initCollection(collection);
      const expectedResult = initCollectionInternal(collection);
      expect(result).toEqual(expectedResult);
   });
});

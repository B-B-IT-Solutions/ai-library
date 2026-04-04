import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";

import { PLibraryCollection } from "@/data/types/db/collection";
import { DCollection } from "@/data/types/domain/collection";

import { toDCollection, toDCollections } from "./collection.mapper";

const toDCollectionsInternal = (
   collections: PLibraryCollection[]
): DCollection[] => {
   return map(collections, (c) => toDCollectionInternal(c));
};

const toDCollectionInternal = (c: PLibraryCollection): DCollection => {
   return {
      id: c.id,
      userId: c.userId,
      name: c.name,
      description: c.description,
      color: c.color,
      order: c.order,
      isPublic: c.isPublic,
      shareToken: c.shareToken,
      templateCount: c._count.entries,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
   };
};

describe("toDCollections tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("toDCollections test", async () => {
      const collections = ptestData.pLibraryCollections();
      const result = toDCollections(collections);
      const expectedResult = toDCollectionsInternal(collections);
      expect(result).toEqual(expectedResult);
   });

   it("toDCollection test", async () => {
      const collection = ptestData.pLibraryCollection();
      const result = toDCollection(collection);
      const expectedResult = toDCollectionInternal(collection);
      expect(result).toEqual(expectedResult);
   });
});

import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";

import { DLibraryCollection } from "@/data/types/domain/library";
import { LibraryCollection } from "@/generated/prisma/client";

import { toDLibraryCollection, toDLibraryCollections } from "./library.mapper";

const toDLibraryCollectionsInternal = (
   collections: LibraryCollection[]
): DLibraryCollection[] => {
   return map(collections, (c) => toDLibraryCollectionInternal(c));
};

const toDLibraryCollectionInternal = (
   collection: LibraryCollection
): DLibraryCollection => {
   return {
      id: collection.id,
      userId: collection.userId,
      name: collection.name,
      description: collection.description,
      color: collection.color,
      order: collection.order,
      createdAt: collection.createdAt.toISOString(),
      updatedAt: collection.updatedAt.toISOString(),
   };
};

describe("toDLibraryCollections tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("toDLibraryCollections test", async () => {
      const collections = ptestData.pLibraryCollections();
      const result = toDLibraryCollections(collections);
      const expectedResult = toDLibraryCollectionsInternal(collections);
      expect(result).toEqual(expectedResult);
   });

   it("toDLibraryCollection test", async () => {
      const collection = ptestData.pLibraryCollection();
      const result = toDLibraryCollection(collection);
      const expectedResult = toDLibraryCollectionInternal(collection);
      expect(result).toEqual(expectedResult);
   });
});

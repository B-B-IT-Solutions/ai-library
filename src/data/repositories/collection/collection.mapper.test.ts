import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";

import { PLibraryCollection } from "@/data/types/db/collection";
import { DCollection } from "@/data/types/domain/collection";

import {
   DEFAULT_COLOR,
   toDCollection,
   toDCollections,
} from "./collection.mapper";

const expectedDefaultColor = "#64748b";

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
      color: c.color ?? expectedDefaultColor,
      order: c.order,
      isPublic: c.isPublic,
      publicToken: c.publicToken,
      templateCount: c._count.entries,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
   };
};

describe("toDCollections tests", () => {
   it("toDCollections test", async () => {
      const collections = ptestData.pTemplateCollections();
      const result = toDCollections(collections);
      const expectedResult = toDCollectionsInternal(collections);
      expect(result).toEqual(expectedResult);
   });

   it("toDCollection test", async () => {
      const collection = ptestData.pTemplateCollection();
      const result = toDCollection(collection);
      const expectedResult = toDCollectionInternal(collection);
      expect(result).toEqual(expectedResult);
   });

   it("default color test", async () => {
      expect(DEFAULT_COLOR).toEqual(expectedDefaultColor);
   });
});

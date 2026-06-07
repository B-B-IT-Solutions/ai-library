import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";

import {
   PLibraryCollection,
   PLibraryCollectionPreview,
} from "@/data/types/db/collection";
import {
   DCollection,
   DCollectionPreview,
} from "@/data/types/domain/collection";

import {
   DEFAULT_COLOR,
   toDCollection,
   toDCollectionPreivew,
   toDCollectionPreviews,
   toDCollections,
} from "./collection.mapper";

const expectedDefaultColor = "#64748b";

const toDCollectionsInternal = (
   collections: PLibraryCollection[]
): DCollection[] => {
   return map(collections, (c) => toDCollectionInternal(c));
};

const toDCollectionPreviewsInternal = (
   collections: PLibraryCollectionPreview[]
): DCollectionPreview[] => {
   return map(collections, (c) => toDCollectionPreviewInternal(c));
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

const toDCollectionPreviewInternal = (
   c: PLibraryCollectionPreview
): DCollectionPreview => {
   return {
      id: c.id,
      name: c.name,
      color: c.color ?? DEFAULT_COLOR,
   };
};

describe("toDCollections tests", () => {
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

   it("default color test", async () => {
      expect(DEFAULT_COLOR).toEqual(expectedDefaultColor);
   });
});

describe("toDCollectionPreviews tests", () => {
   it("toDCollectionPreviews test", async () => {
      const collections = ptestData.pLibraryCollectionPreviews();
      const result = toDCollectionPreviews(collections);
      const expectedResult = toDCollectionPreviewsInternal(collections);
      expect(result).toEqual(expectedResult);
   });

   it("toDCollectionPreivew test", async () => {
      const collection = ptestData.pLibraryCollection();
      const result = toDCollectionPreivew(collection);
      const expectedResult = toDCollectionPreviewInternal(collection);
      expect(result).toEqual(expectedResult);
   });
});

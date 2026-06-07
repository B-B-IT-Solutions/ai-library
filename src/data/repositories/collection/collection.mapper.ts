import { map } from "es-toolkit/compat";

import {
   PLibraryCollection,
   PLibraryCollectionPreview,
} from "@/data/types/db/collection";
import {
   DCollection,
   DCollectionPreview,
} from "@/data/types/domain/collection";

export const DEFAULT_COLOR = "#64748b";

export const toDCollections = (
   collections: PLibraryCollection[]
): DCollection[] => {
   return map(collections, (c) => toDCollection(c));
};

export const toDCollectionPreviews = (
   collections: PLibraryCollectionPreview[]
): DCollectionPreview[] => {
   return map(collections, (c) => toDCollectionPreivew(c));
};

export const toDCollection = (c: PLibraryCollection): DCollection => {
   return {
      id: c.id,
      userId: c.userId,
      name: c.name,
      description: c.description,
      color: c.color ?? DEFAULT_COLOR,
      order: c.order,
      isPublic: c.isPublic,
      publicToken: c.publicToken,
      templateCount: c._count.entries,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
   };
};

export const toDCollectionPreivew = (
   c: PLibraryCollectionPreview
): DCollectionPreview => {
   return {
      id: c.id,
      name: c.name,
      color: c.color ?? DEFAULT_COLOR,
   };
};

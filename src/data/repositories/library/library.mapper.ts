import { map } from "es-toolkit/compat";

import { DLibraryCollection } from "@/data/types/domain/library";
import { LibraryCollection } from "@/generated/prisma/client";

export const toDLibraryCollections = (
   collections: LibraryCollection[]
): DLibraryCollection[] => {
   return map(collections, (c) => toDLibraryCollection(c));
};

export const toDLibraryCollection = (
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

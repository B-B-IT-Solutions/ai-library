import { map } from "es-toolkit/compat";

import { DLibraryCollection } from "@/data/types/domain/library";
import { LibraryCollection } from "@/generated/prisma/client";

type LibraryCollectionWithCount = LibraryCollection & {
   _count?: { entries: number };
};

export const toDLibraryCollections = (
   collections: LibraryCollectionWithCount[]
): DLibraryCollection[] => {
   return map(collections, (c) => toDLibraryCollection(c));
};

export const toDLibraryCollection = (
   collection: LibraryCollectionWithCount
): DLibraryCollection => {
   return {
      id: collection.id,
      userId: collection.userId,
      name: collection.name,
      description: collection.description,
      color: collection.color,
      order: collection.order,
      isPublic: collection.isPublic ?? false,
      shareToken: collection.shareToken,
      templateCount: collection._count?.entries ?? 0,
      createdAt: collection.createdAt.toISOString(),
      updatedAt: collection.updatedAt.toISOString(),
   };
};

import { map } from "es-toolkit/compat";

import { PLibraryCollection } from "@/data/types/db/collection";
import { DLibraryCollection } from "@/data/types/domain/collection";

export const toDCollections = (
   collections: PLibraryCollection[]
): DLibraryCollection[] => {
   return map(collections, (c) => toDCollection(c));
};

export const toDCollection = (c: PLibraryCollection): DLibraryCollection => {
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
